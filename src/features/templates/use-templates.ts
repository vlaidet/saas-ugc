"use client";

import { useReducer, useEffect, useMemo, useCallback } from "react";
import { nanoid } from "nanoid";
import type {
  CustomVariable,
  MessageTemplate,
  TemplateFilters,
  TemplateSortBy,
} from "./types";
import { MOCK_TEMPLATES, getResponseRate } from "./constants";

const STORAGE_KEY = "message-templates";
const CUSTOM_VARIABLES_KEY = "custom-variables";

type TemplateState = {
  templates: MessageTemplate[];
  customVariables: CustomVariable[];
  filters: TemplateFilters;
  sortBy: TemplateSortBy;
  initialized: boolean;
};

type TemplateAction =
  | { type: "INIT"; templates: MessageTemplate[] }
  | {
      type: "ADD";
      template: Omit<
        MessageTemplate,
        "id" | "createdAt" | "updatedAt" | "timesUsed" | "timesReplied"
      >;
    }
  | {
      type: "UPDATE";
      id: string;
      data: Partial<Omit<MessageTemplate, "id" | "createdAt">>;
    }
  | { type: "DELETE"; id: string }
  | { type: "DUPLICATE"; id: string }
  | { type: "INCREMENT_USED"; id: string }
  | { type: "INCREMENT_REPLIED"; id: string }
  | { type: "SET_FILTER"; key: keyof TemplateFilters; value: string }
  | { type: "SET_SORT"; sortBy: TemplateSortBy }
  | { type: "ADD_CUSTOM_VARIABLE"; variable: CustomVariable }
  | { type: "DELETE_CUSTOM_VARIABLE"; key: string };

const initialState: TemplateState = {
  templates: [],
  customVariables: [],
  filters: { channel: "all", niche: "all", search: "" },
  sortBy: "responseRate",
  initialized: false,
};

function reducer(state: TemplateState, action: TemplateAction): TemplateState {
  switch (action.type) {
    case "INIT":
      return { ...state, templates: action.templates, initialized: true };

    case "ADD": {
      const now = new Date().toISOString();
      const newTemplate: MessageTemplate = {
        ...action.template,
        id: nanoid(),
        timesUsed: 0,
        timesReplied: 0,
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, templates: [...state.templates, newTemplate] };
    }

    case "UPDATE":
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === action.id
            ? { ...t, ...action.data, updatedAt: new Date().toISOString() }
            : t,
        ),
      };

    case "DELETE":
      return {
        ...state,
        templates: state.templates.filter((t) => t.id !== action.id),
      };

    case "DUPLICATE": {
      const source = state.templates.find((t) => t.id === action.id);
      if (!source) return state;
      const now = new Date().toISOString();
      return {
        ...state,
        templates: [
          ...state.templates,
          {
            ...source,
            id: nanoid(),
            title: `${source.title} (copie)`,
            timesUsed: 0,
            timesReplied: 0,
            createdAt: now,
            updatedAt: now,
          },
        ],
      };
    }

    case "INCREMENT_USED":
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === action.id
            ? {
                ...t,
                timesUsed: t.timesUsed + 1,
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      };

    case "INCREMENT_REPLIED":
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === action.id
            ? {
                ...t,
                timesReplied: t.timesReplied + 1,
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      };

    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
      };

    case "SET_SORT":
      return { ...state, sortBy: action.sortBy };

    case "ADD_CUSTOM_VARIABLE": {
      const exists = state.customVariables.some(
        (v) => v.key === action.variable.key,
      );
      if (exists) return state;
      return {
        ...state,
        customVariables: [...state.customVariables, action.variable],
      };
    }

    case "DELETE_CUSTOM_VARIABLE":
      return {
        ...state,
        customVariables: state.customVariables.filter(
          (v) => v.key !== action.key,
        ),
      };

    default:
      return state;
  }
}

function createMockTemplates(): MessageTemplate[] {
  const now = new Date().toISOString();
  return MOCK_TEMPLATES.map((t) => ({
    ...t,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  }));
}

export function useTemplates() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialisation depuis localStorage ou mock data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let templates: MessageTemplate[];

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as MessageTemplate[];
        if (parsed.length > 0) {
          templates = parsed;
        } else {
          templates = createMockTemplates();
        }
      } catch {
        templates = createMockTemplates();
      }
    } else {
      templates = createMockTemplates();
    }

    dispatch({ type: "INIT", templates });

    const storedVars = localStorage.getItem(CUSTOM_VARIABLES_KEY);
    if (storedVars) {
      try {
        const parsed = JSON.parse(storedVars) as CustomVariable[];
        for (const v of parsed) {
          dispatch({ type: "ADD_CUSTOM_VARIABLE", variable: v });
        }
      } catch {
        // Ignorer les données corrompues
      }
    }
  }, []);

  // Persistance localStorage — templates
  useEffect(() => {
    if (state.initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.templates));
    }
  }, [state.templates, state.initialized]);

  // Persistance localStorage — variables custom
  useEffect(() => {
    if (state.initialized) {
      localStorage.setItem(
        CUSTOM_VARIABLES_KEY,
        JSON.stringify(state.customVariables),
      );
    }
  }, [state.customVariables, state.initialized]);

  // Templates filtrés et triés
  const templates = useMemo(() => {
    let result = [...state.templates];

    const { channel, niche, search } = state.filters;

    if (channel !== "all") {
      result = result.filter((t) => t.channel === channel);
    }
    if (niche !== "all") {
      result = result.filter((t) => t.niche === niche);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q),
      );
    }

    // Tri par défaut : meilleur taux de réponse en premier
    switch (state.sortBy) {
      case "responseRate":
        result.sort(
          (a, b) =>
            getResponseRate(b.timesUsed, b.timesReplied) -
            getResponseRate(a.timesUsed, a.timesReplied),
        );
        break;
      case "timesUsed":
        result.sort((a, b) => b.timesUsed - a.timesUsed);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return result;
  }, [state.templates, state.filters, state.sortBy]);

  const addTemplate = useCallback(
    (
      template: Omit<
        MessageTemplate,
        "id" | "createdAt" | "updatedAt" | "timesUsed" | "timesReplied"
      >,
    ) => dispatch({ type: "ADD", template }),
    [],
  );

  const updateTemplate = useCallback(
    (id: string, data: Partial<Omit<MessageTemplate, "id" | "createdAt">>) =>
      dispatch({ type: "UPDATE", id, data }),
    [],
  );

  const deleteTemplate = useCallback(
    (id: string) => dispatch({ type: "DELETE", id }),
    [],
  );

  const duplicateTemplate = useCallback(
    (id: string) => dispatch({ type: "DUPLICATE", id }),
    [],
  );

  const incrementUsed = useCallback(
    (id: string) => dispatch({ type: "INCREMENT_USED", id }),
    [],
  );

  const incrementReplied = useCallback(
    (id: string) => dispatch({ type: "INCREMENT_REPLIED", id }),
    [],
  );

  const setFilter = useCallback(
    (key: keyof TemplateFilters, value: string) =>
      dispatch({ type: "SET_FILTER", key, value }),
    [],
  );

  const setSortBy = useCallback(
    (sortBy: TemplateSortBy) => dispatch({ type: "SET_SORT", sortBy }),
    [],
  );

  const addCustomVariable = useCallback(
    (variable: CustomVariable) =>
      dispatch({ type: "ADD_CUSTOM_VARIABLE", variable }),
    [],
  );

  const deleteCustomVariable = useCallback(
    (key: string) => dispatch({ type: "DELETE_CUSTOM_VARIABLE", key }),
    [],
  );

  return {
    templates,
    allTemplates: state.templates,
    customVariables: state.customVariables,
    filters: state.filters,
    sortBy: state.sortBy,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    incrementUsed,
    incrementReplied,
    setFilter,
    setSortBy,
    addCustomVariable,
    deleteCustomVariable,
  };
}
