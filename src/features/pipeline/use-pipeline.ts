"use client";
import { useReducer, useCallback } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type {
  Brand,
  BrandStatus,
  ContactEntry,
  PipelineFilters,
  PipelineView,
} from "./types";
import {
  createBrandAction,
  updateBrandAction,
  deleteBrandAction,
  changeStatusAction,
  addContactAction,
} from "./pipeline.action";
import { FOLLOWUP_DAYS } from "./constants";

type PipelineState = {
  brands: Brand[];
  view: PipelineView;
  filters: PipelineFilters;
  draggedBrandId: string | null;
};

type PipelineAction =
  | { type: "ADD_BRAND"; brand: Brand }
  | {
      type: "UPDATE_BRAND";
      id: string;
      updates: Partial<Brand>;
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
  | { type: "ADD_CONTACT"; brandId: string; contact: ContactEntry }
  | { type: "SET_VIEW"; view: PipelineView }
  | { type: "SET_FILTER"; key: keyof PipelineFilters; value: string }
  | { type: "SET_DRAGGED"; id: string | null };

const initialFilters: PipelineFilters = {
  niche: "all",
  status: "all",
  channel: "all",
  search: "",
  datePreset: "all",
  dateFrom: "",
  dateTo: "",
};

function pipelineReducer(
  state: PipelineState,
  action: PipelineAction,
): PipelineState {
  switch (action.type) {
    case "ADD_BRAND":
      return {
        ...state,
        brands: [action.brand, ...state.brands],
      };

    case "UPDATE_BRAND":
      return {
        ...state,
        brands: state.brands.map((b) =>
          b.id === action.id ? { ...b, ...action.updates } : b,
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
            ? { ...b, contacts: [...b.contacts, action.contact] }
            : b,
        ),
      };

    case "SET_VIEW":
      return { ...state, view: action.view };

    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
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

export function usePipeline(initialBrands: Brand[]) {
  const [state, dispatch] = useReducer(pipelineReducer, {
    brands: initialBrands,
    view: "kanban" as PipelineView,
    filters: initialFilters,
    draggedBrandId: null,
  });

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

  const addBrand = useCallback(
    async (input: Omit<Brand, "id" | "contacts" | "createdAt">) => {
      const optimisticId = nanoid(11);
      const optimisticBrand: Brand = {
        ...input,
        id: optimisticId,
        contacts: [],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_BRAND", brand: optimisticBrand });

      try {
        const created = await resolveActionResult(
          createBrandAction({
            name: input.name,
            niche: input.niche,
            channel: input.channel,
            status: input.status,
            profileUrl: input.profileUrl ?? undefined,
            email: input.email ?? undefined,
            notes: input.notes ?? undefined,
            product: input.product ?? undefined,
          }),
        );
        dispatch({
          type: "UPDATE_BRAND",
          id: optimisticId,
          updates: { id: created.id },
        });
      } catch {
        dispatch({ type: "DELETE_BRAND", id: optimisticId });
        toast.error("Erreur lors de l'ajout de la marque");
      }
    },
    [],
  );

  const updateBrand = useCallback(
    async (id: string, updates: Partial<Brand>) => {
      const { contacts: _, createdAt: __, ...safeUpdates } = updates;
      dispatch({ type: "UPDATE_BRAND", id, updates: safeUpdates });

      try {
        await resolveActionResult(
          updateBrandAction({
            id,
            data: {
              name: safeUpdates.name,
              niche: safeUpdates.niche,
              channel: safeUpdates.channel,
              status: safeUpdates.status,
              profileUrl: safeUpdates.profileUrl ?? undefined,
              email: safeUpdates.email ?? undefined,
              notes: safeUpdates.notes ?? undefined,
              product: safeUpdates.product ?? undefined,
            },
          }),
        );
      } catch {
        toast.error("Erreur lors de la mise à jour");
      }
    },
    [],
  );

  const deleteBrand = useCallback(
    async (id: string) => {
      const prev = state.brands.find((b) => b.id === id);
      dispatch({ type: "DELETE_BRAND", id });

      try {
        await resolveActionResult(deleteBrandAction({ id }));
      } catch {
        if (prev) dispatch({ type: "ADD_BRAND", brand: prev });
        toast.error("Erreur lors de la suppression");
      }
    },
    [state.brands],
  );

  const changeStatus = useCallback(async (id: string, status: BrandStatus) => {
    dispatch({ type: "CHANGE_STATUS", id, status });

    try {
      await resolveActionResult(changeStatusAction({ id, status }));
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  }, []);

  const reorderBrand = useCallback(
    (
      dragId: string,
      targetId: string,
      position: "before" | "after",
      status: BrandStatus,
    ) => {
      dispatch({ type: "REORDER_BRAND", dragId, targetId, position, status });
      // Le reorder change potentiellement le status, donc on sync
      changeStatusAction({ id: dragId, status }).catch(() => {
        toast.error("Erreur lors du changement de statut");
      });
    },
    [],
  );

  const addContact = useCallback(
    async (brandId: string, contact: Omit<ContactEntry, "id">) => {
      const optimisticContact: ContactEntry = {
        ...contact,
        id: nanoid(11),
      };
      dispatch({ type: "ADD_CONTACT", brandId, contact: optimisticContact });

      try {
        await resolveActionResult(
          addContactAction({
            brandId,
            date:
              typeof contact.date === "string"
                ? contact.date
                : contact.date.toISOString(),
            channel: contact.channel,
            message: contact.message,
            response: contact.response ?? undefined,
          }),
        );
      } catch {
        toast.error("Erreur lors de l'ajout du contact");
      }
    },
    [],
  );

  return {
    state,
    brands: filteredBrands,
    allBrands: state.brands,
    view: state.view,
    filters: state.filters,
    draggedBrandId: state.draggedBrandId,
    needsFollowUp,

    addBrand,
    updateBrand,
    deleteBrand,
    changeStatus,
    reorderBrand,
    addContact,

    setView: (view: PipelineView) => dispatch({ type: "SET_VIEW", view }),
    setFilter: (key: keyof PipelineFilters, value: string) =>
      dispatch({ type: "SET_FILTER", key, value }),
    setDragged: (id: string | null) => dispatch({ type: "SET_DRAGGED", id }),
  };
}
