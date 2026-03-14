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

    addContact: (brandId: string, contact: Omit<ContactEntry, "id">) =>
      dispatch({ type: "ADD_CONTACT", brandId, contact }),

    setView: (view: PipelineView) => dispatch({ type: "SET_VIEW", view }),

    setFilter: (key: keyof PipelineFilters, value: string) =>
      dispatch({ type: "SET_FILTER", key, value }),

    setDragged: (id: string | null) => dispatch({ type: "SET_DRAGGED", id }),
  };
}
