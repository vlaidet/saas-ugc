"use client";
import { useState } from "react";
import { toast } from "sonner";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { usePipeline } from "./use-pipeline";
import { PipelineCounters } from "./components/pipeline-counters";
import { PipelineFilters } from "./components/pipeline-filters";
import { BrandFormDialog } from "./components/brand-form-dialog";
import { ContactHistoryDialog } from "./components/contact-history-dialog";
import { KanbanView } from "./components/kanban-view";
import { ListView } from "./components/list-view";
import type { Brand, BrandNiche, ContactChannel } from "./types";
import { Plus, LayoutGrid, List } from "lucide-react";

type BrandFormData = {
  name: string;
  niche: string;
  channel: string;
  profileUrl?: string;
  email?: string;
  notes?: string;
};

type ContactFormData = {
  date: string;
  channel: ContactChannel;
  message: string;
  response?: string;
};

export default function PipelinePage() {
  const pipeline = usePipeline();
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandFormOpen, setBrandFormOpen] = useState(false);
  const [contactHistoryOpen, setContactHistoryOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const handleAddBrand = (data: BrandFormData) => {
    pipeline.addBrand({
      name: data.name,
      niche: data.niche as BrandNiche,
      channel: data.channel as ContactChannel,
      profileUrl: data.profileUrl || undefined,
      email: data.email || undefined,
      notes: data.notes || undefined,
      status: "À contacter",
    } as Omit<Brand, "id" | "contacts" | "createdAt">);
    toast.success("Marque ajoutée");
    setEditingBrand(null);
  };

  const handleEditBrand = (data: BrandFormData) => {
    if (!editingBrand) return;
    pipeline.updateBrand(editingBrand.id, {
      name: data.name,
      niche: data.niche as BrandNiche,
      channel: data.channel as ContactChannel,
      profileUrl: data.profileUrl || undefined,
      email: data.email || undefined,
      notes: data.notes || undefined,
      status: editingBrand.status,
    } as Omit<Brand, "id" | "contacts" | "createdAt">);
    toast.success("Marque mise à jour");
    setEditingBrand(null);
  };

  const handleDeleteBrand = (brandId: string) => {
    dialogManager.confirm({
      title: "Supprimer la marque",
      description: "Êtes-vous sûr ? Cette action est irréversible.",
      variant: "destructive",
      action: {
        label: "Supprimer",
        onClick: async () => {
          pipeline.deleteBrand(brandId);
          toast.success("Marque supprimée");
        },
      },
    });
  };

  const handleAddContact = (brandId: string, contact: ContactFormData) => {
    pipeline.addContact(brandId, {
      date: contact.date,
      channel: contact.channel,
      message: contact.message,
      response: contact.response,
    });
    toast.success("Contact ajouté");
    setContactHistoryOpen(false);
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandFormOpen(true);
  };

  const openContactHistory = (brand: Brand) => {
    setSelectedBrand(brand);
    setContactHistoryOpen(true);
  };

  const handleBrandFormSubmit = (data: BrandFormData) => {
    if (editingBrand) {
      handleEditBrand(data);
    } else {
      handleAddBrand(data);
    }
  };

  return (
    <div
      className="-mx-4 -mb-4 min-h-full"
      style={{ backgroundColor: "#FAF6F1" }}
    >
      {/* PAGE HEADER */}
      <div
        style={{ borderBottomColor: "#EDE0D0" }}
        className="border-b px-6 pt-6 pb-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#3D2314" }}>
              Pipeline de Prospection
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#A89880" }}>
              Suivez et gérez vos contacts marques
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle - pill shape */}
            <div
              className="flex items-center rounded-lg p-0.5"
              style={{ backgroundColor: "#EDE0D0" }}
            >
              <button
                onClick={() => pipeline.setView("kanban")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  pipeline.view === "kanban"
                    ? "bg-white shadow-sm"
                    : "hover:text-[#3D2314]"
                }`}
                style={
                  pipeline.view === "kanban"
                    ? { color: "#3D2314" }
                    : { color: "#6B4226" }
                }
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </button>
              <button
                onClick={() => pipeline.setView("list")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  pipeline.view === "list"
                    ? "bg-white shadow-sm"
                    : "hover:text-[#3D2314]"
                }`}
                style={
                  pipeline.view === "list"
                    ? { color: "#3D2314" }
                    : { color: "#6B4226" }
                }
              >
                <List className="h-4 w-4" />
                Liste
              </button>
            </div>
            {/* Add button */}
            <button
              onClick={() => {
                setEditingBrand(null);
                setBrandFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C4621D" }}
            >
              <Plus className="h-4 w-4" />
              Ajouter une marque
            </button>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <PipelineCounters brands={pipeline.allBrands} />

      {/* FILTERS */}
      <div
        style={{ borderBottomColor: "#EDE0D0" }}
        className="border-b px-6 py-3"
      >
        <PipelineFilters
          filters={pipeline.filters}
          onFilterChange={(key, value) => pipeline.setFilter(key, value)}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="px-6 py-4">
        {pipeline.view === "kanban" ? (
          <KanbanView
            brands={pipeline.brands}
            onEdit={openEditDialog}
            onDelete={handleDeleteBrand}
            onHistory={openContactHistory}
            onStatusChange={(brandId, status) => {
              pipeline.changeStatus(brandId, status);
              const brand = pipeline.allBrands.find((b) => b.id === brandId);
              if (brand) {
                toast.success(`Marque déplacée à "${status}"`);
              }
            }}
            onDragStart={pipeline.setDragged}
            needsFollowUp={pipeline.needsFollowUp}
          />
        ) : (
          <ListView
            brands={pipeline.brands}
            onEdit={openEditDialog}
            onDelete={handleDeleteBrand}
            onHistory={openContactHistory}
            onStatusChange={(brandId, status) => {
              pipeline.changeStatus(brandId, status);
              toast.success(`Marque déplacée à "${status}"`);
            }}
            onDragStart={pipeline.setDragged}
            needsFollowUp={pipeline.needsFollowUp}
          />
        )}
      </div>

      {/* Dialogs */}
      <BrandFormDialog
        open={brandFormOpen}
        onOpenChange={setBrandFormOpen}
        onSubmit={handleBrandFormSubmit}
        defaultValues={editingBrand}
      />

      <ContactHistoryDialog
        open={contactHistoryOpen}
        onOpenChange={setContactHistoryOpen}
        brand={selectedBrand}
        onAddContact={(contact) => {
          if (selectedBrand) {
            handleAddContact(selectedBrand.id, contact);
          }
        }}
      />
    </div>
  );
}
