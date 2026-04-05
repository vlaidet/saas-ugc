"use client";

import { useReducer, useMemo, useCallback } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type {
  CustomVariable,
  MessageTemplate,
  TemplateFilters,
  TemplateSortBy,
} from "./types";
import { getResponseRate } from "./constants";
import {
  createTemplateAction,
  updateTemplateAction,
  deleteTemplateAction,
  duplicateTemplateAction,
  incrementUsedAction,
  incrementRepliedAction,
  addCustomVariableAction,
  deleteCustomVariableAction,
} from "./templates.action";

type TemplateState = {
  templates: MessageTemplate[];
  customVariables: CustomVariable[];
  filters: TemplateFilters;
  sortBy: TemplateSortBy;
};

type TemplateAction =
  | { type: "ADD"; template: MessageTemplate }
  | { type: "UPDATE_ID"; oldId: string; newId: string }
  | {
      type: "UPDATE";
      id: string;
      data: Partial<Omit<MessageTemplate, "id" | "createdAt">>;
    }
  | { type: "DELETE"; id: string }
  | { type: "DUPLICATE"; source: MessageTemplate }
  | { type: "INCREMENT_USED"; id: string }
  | { type: "INCREMENT_REPLIED"; id: string }
  | { type: "SET_FILTER"; key: keyof TemplateFilters; value: string }
  | { type: "SET_SORT"; sortBy: TemplateSortBy }
  | { type: "ADD_CUSTOM_VARIABLE"; variable: CustomVariable }
  | { type: "DELETE_CUSTOM_VARIABLE"; key: string };

function reducer(state: TemplateState, action: TemplateAction): TemplateState {
  switch (action.type) {
    case "ADD":
      return { ...state, templates: [action.template, ...state.templates] };

    case "UPDATE_ID":
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === action.oldId ? { ...t, id: action.newId } : t,
        ),
      };

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

    case "DUPLICATE":
      return {
        ...state,
        templates: [...state.templates, action.source],
      };

    case "INCREMENT_USED":
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === action.id ? { ...t, timesUsed: t.timesUsed + 1 } : t,
        ),
      };

    case "INCREMENT_REPLIED":
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === action.id ? { ...t, timesReplied: t.timesReplied + 1 } : t,
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

type UseTemplatesInit = {
  initialTemplates: MessageTemplate[];
  initialCustomVariables: CustomVariable[];
};

export function useTemplates({
  initialTemplates,
  initialCustomVariables,
}: UseTemplatesInit) {
  const [state, dispatch] = useReducer(reducer, {
    templates: initialTemplates,
    customVariables: initialCustomVariables,
    filters: { channel: "all", niche: "all", search: "" },
    sortBy: "responseRate" as TemplateSortBy,
  });

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
    async (
      input: Omit<
        MessageTemplate,
        "id" | "createdAt" | "updatedAt" | "timesUsed" | "timesReplied"
      >,
    ) => {
      const now = new Date().toISOString();
      const optimisticId = nanoid(11);
      const optimistic: MessageTemplate = {
        ...input,
        id: optimisticId,
        timesUsed: 0,
        timesReplied: 0,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "ADD", template: optimistic });

      try {
        const created = await resolveActionResult(
          createTemplateAction({
            title: input.title,
            channel: input.channel,
            niche: input.niche,
            content: input.content,
          }),
        );
        dispatch({ type: "UPDATE_ID", oldId: optimisticId, newId: created.id });
      } catch {
        dispatch({ type: "DELETE", id: optimisticId });
        toast.error("Erreur lors de la création du template");
      }
    },
    [],
  );

  const updateTemplate = useCallback(
    async (
      id: string,
      data: Partial<Omit<MessageTemplate, "id" | "createdAt">>,
    ) => {
      dispatch({ type: "UPDATE", id, data });

      try {
        await resolveActionResult(
          updateTemplateAction({
            id,
            data: {
              title: data.title,
              channel: data.channel,
              niche: data.niche,
              content: data.content,
            },
          }),
        );
      } catch {
        toast.error("Erreur lors de la mise à jour");
      }
    },
    [],
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      const prev = state.templates.find((t) => t.id === id);
      dispatch({ type: "DELETE", id });

      try {
        await resolveActionResult(deleteTemplateAction({ id }));
      } catch {
        if (prev) dispatch({ type: "ADD", template: prev });
        toast.error("Erreur lors de la suppression");
      }
    },
    [state.templates],
  );

  const duplicateTemplate = useCallback(
    async (id: string) => {
      const source = state.templates.find((t) => t.id === id);
      if (!source) return;

      const now = new Date().toISOString();
      const optimisticId = nanoid(11);
      const copy: MessageTemplate = {
        ...source,
        id: optimisticId,
        title: `${source.title} (copie)`,
        timesUsed: 0,
        timesReplied: 0,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "DUPLICATE", source: copy });

      try {
        const created = await resolveActionResult(
          duplicateTemplateAction({ id }),
        );
        dispatch({ type: "UPDATE_ID", oldId: optimisticId, newId: created.id });
      } catch {
        dispatch({ type: "DELETE", id: optimisticId });
        toast.error("Erreur lors de la duplication");
      }
    },
    [state.templates],
  );

  const incrementUsed = useCallback(async (id: string) => {
    dispatch({ type: "INCREMENT_USED", id });
    try {
      await resolveActionResult(incrementUsedAction({ id }));
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  }, []);

  const incrementReplied = useCallback(async (id: string) => {
    dispatch({ type: "INCREMENT_REPLIED", id });
    try {
      await resolveActionResult(incrementRepliedAction({ id }));
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  }, []);

  const addCustomVariable = useCallback(async (variable: CustomVariable) => {
    dispatch({ type: "ADD_CUSTOM_VARIABLE", variable });
    try {
      await resolveActionResult(addCustomVariableAction(variable));
    } catch {
      dispatch({ type: "DELETE_CUSTOM_VARIABLE", key: variable.key });
      toast.error("Erreur lors de l'ajout de la variable");
    }
  }, []);

  const deleteCustomVariable = useCallback(
    async (key: string) => {
      const prev = state.customVariables.find((v) => v.key === key);
      dispatch({ type: "DELETE_CUSTOM_VARIABLE", key });
      try {
        await resolveActionResult(deleteCustomVariableAction({ key }));
      } catch {
        if (prev) dispatch({ type: "ADD_CUSTOM_VARIABLE", variable: prev });
        toast.error("Erreur lors de la suppression");
      }
    },
    [state.customVariables],
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
    setFilter: useCallback(
      (key: keyof TemplateFilters, value: string) =>
        dispatch({ type: "SET_FILTER", key, value }),
      [],
    ),
    setSortBy: useCallback(
      (sortBy: TemplateSortBy) => dispatch({ type: "SET_SORT", sortBy }),
      [],
    ),
    addCustomVariable,
    deleteCustomVariable,
  };
}
