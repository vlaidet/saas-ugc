"use client";
import { useReducer, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import type {
  Brand,
  BrandStatus,
  ContactEntry,
  PipelineFilters,
  PipelineView,
} from "./types";
import { MOCK_BRANDS } from "./mock-data";
import { FOLLOWUP_DAYS } from "./constants";

type PipelineState = {
  brands: Brand[];
  view: PipelineView;
  filters: PipelineFilters;
  draggedBrandId: string | null;
};

type PipelineAction =
  | { type: "ADD_BRAND"; brand: Omit<Brand, "id" | "contacts" | "createdAt"> }
  | {
      type: "UPDATE_BRAND";
      id: string;
      updates: Omit<Brand, "id" | "contacts" | "createdAt">;
    }
  | { type: "DELETE_BRAND"; id: string }
  | { type: "CHANGE_STATUS"; id: string; status: BrandStatus }
  | {
      type: "REORDER_BRAND";
      dragId: string;
      targetId: string;
      position: "before" | "after";
      status: BrandStatus;
    }
  | { type: "ADD_CONTACT"; brandId: string; contact: Omit<ContactEntry, "id"> }
  | { type: "SET_VIEW"; view: PipelineView }
  | { type: "SET_FILTER"; key: keyof PipelineFilters; value: string }
  | { type: "SET_DRAGGED"; id: string | null }
  | { type: "INIT"; brands: Brand[] };

const initialState: PipelineState = {
  brands: [],
  view: "kanban",
  filters: {
    niche: "all",
    status: "all",
    channel: "all",
    search: "",
    datePreset: "all",
    dateFrom: "",
    dateTo: "",
  },
  draggedBrandId: null,
};

function pipelineReducer(
  state: PipelineState,
  action: PipelineAction,
): PipelineState {
  switch (action.type) {
    case "INIT":
      return { ...state, brands: action.brands };

    case "ADD_BRAND":
      return {
        ...state,
        brands: [
          ...state.brands,
          {
            ...action.brand,
            id: nanoid(),
            contacts: [],
            createdAt: new Date().toISOString(),
          },
        ],
      };

    case "UPDATE_BRAND":
      return {
        ...state,
        brands: state.brands.map((b) =>
          b.id === action.id
            ? {
                ...b,
                ...action.updates,
              }
            : b,
        ),
      };

    case "DELETE_BRAND":
      return {
        ...state,
        brands: state.brands.filter((b) => b.id !== action.id),
      };

    case "CHANGE_STATUS":
      return {
        ...state,
        brands: state.brands.map((b) =>
          b.id === action.id ? { ...b, status: action.status } : b,
        ),
      };

    case "REORDER_BRAND": {
      const dragged = state.brands.find((b) => b.id === action.dragId);
      if (!dragged) return state;
      const withoutDragged = state.brands.filter((b) => b.id !== action.dragId);
      const targetIdx = withoutDragged.findIndex(
        (b) => b.id === action.targetId,
      );
      if (targetIdx === -1) return state;
      const insertIdx =
        action.position === "before" ? targetIdx : targetIdx + 1;
      const updated = { ...dragged, status: action.status };
      return {
        ...state,
        brands: [
          ...withoutDragged.slice(0, insertIdx),
          updated,
          ...withoutDragged.slice(insertIdx),
        ],
      };
    }

    case "ADD_CONTACT":
      return {
        ...state,
        brands: state.brands.map((b) =>
          b.id === action.brandId
            ? {
                ...b,
                contacts: [
                  ...b.contacts,
                  {
                    ...action.contact,
                    id: nanoid(),
                  },
                ],
              }
            : b,
        ),
      };

    case "SET_VIEW":
      return { ...state, view: action.view };

    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.key]: action.value,
        },
      };

    case "SET_DRAGGED":
      return { ...state, draggedBrandId: action.id };

    default:
      return state;
  }
}

function getDateRange(
  preset: string,
  dateFrom: string,
  dateTo: string,
): { from: Date | null; to: Date | null } {
  const now = new Date();

  switch (preset) {
    case "today": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
      );
      return { from: start, to: end };
    }
    case "this_week": {
      const dow = now.getDay();
      const start = new Date(now);
      start.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { from: start, to: end };
    }
    case "last_week": {
      const dow = now.getDay();
      const thisMonday = new Date(now);
      thisMonday.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
      const lastMonday = new Date(thisMonday);
      lastMonday.setDate(thisMonday.getDate() - 7);
      lastMonday.setHours(0, 0, 0, 0);
      const lastSunday = new Date(thisMonday);
      lastSunday.setDate(thisMonday.getDate() - 1);
      lastSunday.setHours(23, 59, 59, 999);
      return { from: lastMonday, to: lastSunday };
    }
    case "this_month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
      );
      return { from: start, to: end };
    }
    case "last_month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return { from: start, to: end };
    }
    case "this_year": {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      return { from: start, to: end };
    }
    case "last_year": {
      const start = new Date(now.getFullYear() - 1, 0, 1);
      const end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
      return { from: start, to: end };
    }
    case "custom": {
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
      return { from, to };
    }
    default:
      return { from: null, to: null };
  }
}

export function usePipeline() {
  const [state, dispatch] = useReducer(pipelineReducer, initialState);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pipeline-brands");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: "INIT", brands: parsed });
      } catch {
        dispatch({ type: "INIT", brands: MOCK_BRANDS });
      }
    } else {
      dispatch({ type: "INIT", brands: MOCK_BRANDS });
    }
  }, []);

  // Save to localStorage whenever brands change
  useEffect(() => {
    localStorage.setItem("pipeline-brands", JSON.stringify(state.brands));
  }, [state.brands]);

  // Filter brands
  const filteredBrands = state.brands.filter((brand) => {
    if (state.filters.niche !== "all" && brand.niche !== state.filters.niche)
      return false;
    if (state.filters.status !== "all" && brand.status !== state.filters.status)
      return false;
    if (
      state.filters.channel !== "all" &&
      brand.channel !== state.filters.channel
    )
      return false;
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      if (!brand.name.toLowerCase().includes(search)) return false;
    }
    if (state.filters.datePreset !== "all") {
      const { from, to } = getDateRange(
        state.filters.datePreset,
        state.filters.dateFrom,
        state.filters.dateTo,
      );
      const createdAt = new Date(brand.createdAt);
      if (from && createdAt < from) return false;
      if (to && createdAt > to) return false;
    }
    return true;
  });

  // Helper to check if a brand needs follow-up
  const needsFollowUp = useCallback((brand: Brand): boolean => {
    if (brand.status === "Contactée") {
      if (brand.contacts.length === 0) {
        const createdDate = new Date(brand.createdAt);
        const daysSinceCreated = Math.floor(
          (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return daysSinceCreated > FOLLOWUP_DAYS;
      }
      const lastContact = brand.contacts[brand.contacts.length - 1];
      const lastContactDate = new Date(lastContact.date);
      const daysSinceLastContact = Math.floor(
        (Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysSinceLastContact > FOLLOWUP_DAYS;
    }
    return false;
  }, []);

  return {
    state,
    brands: filteredBrands,
    allBrands: state.brands,
    view: state.view,
    filters: state.filters,
    draggedBrandId: state.draggedBrandId,
    needsFollowUp,

    addBrand: (brand: Omit<Brand, "id" | "contacts" | "createdAt">) =>
      dispatch({ type: "ADD_BRAND", brand }),

    updateBrand: (
      id: string,
      updates: Omit<Brand, "id" | "contacts" | "createdAt">,
    ) => dispatch({ type: "UPDATE_BRAND", id, updates }),

    deleteBrand: (id: string) => dispatch({ type: "DELETE_BRAND", id }),

    changeStatus: (id: string, status: BrandStatus) =>
      dispatch({ type: "CHANGE_STATUS", id, status }),

    reorderBrand: (
      dragId: string,
      targetId: string,
      position: "before" | "after",
      status: BrandStatus,
    ) =>
      dispatch({ type: "REORDER_BRAND", dragId, targetId, position, status }),

    addContact: (brandId: string, contact: Omit<ContactEntry, "id">) =>
      dispatch({ type: "ADD_CONTACT", brandId, contact }),

    setView: (view: PipelineView) => dispatch({ type: "SET_VIEW", view }),

    setFilter: (key: keyof PipelineFilters, value: string) =>
      dispatch({ type: "SET_FILTER", key, value }),

    setDragged: (id: string | null) => dispatch({ type: "SET_DRAGGED", id }),
  };
}
