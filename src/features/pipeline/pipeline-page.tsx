"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { usePipeline } from "./use-pipeline";
import { PipelineCounters } from "./components/pipeline-counters";
import { PipelineFilters } from "./components/pipeline-filters";
import { BrandFormDialog } from "./components/brand-form-dialog";
import { ContactHistoryDialog } from "./components/contact-history-dialog";
import { KanbanView } from "./components/kanban-view";
import { ListView } from "./components/list-view";
import { CommandPalette } from "./components/command-palette";
import { DateRangeFilter } from "./components/date-range-filter";
import type { Brand, BrandNiche, ContactChannel } from "./types";
import { Plus, LayoutGrid, List, Target, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

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

  // État de la palette de commandes (contrôlé depuis ici)
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteIndex, setPaletteIndex] = useState(0);

  // Écoute globale Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        setPaletteQuery("");
        setPaletteIndex(0);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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
    setBrandFormOpen(false);
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
    setBrandFormOpen(false);
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

  const openPalette = () => {
    setPaletteQuery("");
    setPaletteIndex(0);
    setPaletteOpen(true);
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: "#FAF6F1" }}
    >
      {/* TOP NAVBAR — sticky grâce au h-screen overflow-hidden sur le parent */}
      <header
        className="sticky top-0 z-20 flex flex-shrink-0 items-center gap-3 px-6 py-3"
        style={{
          backgroundColor: "rgba(250,246,241,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #EDE0D0",
        }}
      >
        {/* Sidebar toggle + Logo + title */}
        <SidebarTrigger className="flex-shrink-0" />
        <div className="flex flex-shrink-0 items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#C4621D" }}
          >
            <Target className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1
              className="text-base leading-none font-bold"
              style={{ color: "#3D2314" }}
            >
              Pipeline de Prospection
            </h1>
            <p
              className="mt-0.5 text-xs leading-none"
              style={{ color: "#A89880" }}
            >
              Gérez vos contacts marques
            </p>
          </div>
        </div>

        {/* Filtre date + Search — centre */}
        <div className="flex flex-1 items-center gap-2 px-2">
          <DateRangeFilter
            filters={pipeline.filters}
            onFilterChange={(key, value) => pipeline.setFilter(key, value)}
          />

          {/* Barre de recherche — clic ouvre la palette */}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: "#A89880" }}
            />
            <input
              type="text"
              readOnly
              placeholder="Rechercher une marque..."
              onClick={openPalette}
              className="h-9 w-full cursor-pointer rounded-xl border bg-white/70 pr-16 pl-9 text-sm transition-all duration-200 outline-none hover:bg-white hover:shadow-sm"
              style={{
                borderColor: "#EDE0D0",
                color: "#3D2314",
                boxShadow: "0 1px 3px rgba(61,35,20,0.04)",
              }}
            />
            {/* Badge ⌘K */}
            <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
              <kbd
                className="rounded border px-1.5 py-0.5 text-[10px] font-medium"
                style={{
                  borderColor: "#EDE0D0",
                  color: "#A89880",
                  backgroundColor: "#F5F0EB",
                }}
              >
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* View toggle + add button */}
        <div className="flex flex-shrink-0 items-center gap-2.5">
          <div
            className="flex items-center gap-0.5 rounded-xl p-1"
            style={{ backgroundColor: "#EDE0D0" }}
          >
            <button
              onClick={() => pipeline.setView("kanban")}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
              style={
                pipeline.view === "kanban"
                  ? {
                      backgroundColor: "white",
                      color: "#3D2314",
                      boxShadow: "0 1px 3px rgba(61,35,20,0.1)",
                    }
                  : { backgroundColor: "transparent", color: "#6B4226" }
              }
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              onClick={() => pipeline.setView("list")}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
              style={
                pipeline.view === "list"
                  ? {
                      backgroundColor: "white",
                      color: "#3D2314",
                      boxShadow: "0 1px 3px rgba(61,35,20,0.1)",
                    }
                  : { backgroundColor: "transparent", color: "#6B4226" }
              }
            >
              <List className="h-3.5 w-3.5" />
              Liste
            </button>
          </div>

          <button
            onClick={() => {
              setEditingBrand(null);
              setBrandFormOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            style={{
              backgroundColor: "#C4621D",
              boxShadow: "0 1px 4px rgba(196,98,29,0.3)",
            }}
          >
            <Plus className="h-4 w-4" />
            Ajouter une marque
          </button>
        </div>
      </header>

      {/* Zone scrollable */}
      <div className="flex flex-1 flex-col overflow-auto">
        {/* STATS — reçoit les marques filtrées */}
        <PipelineCounters brands={pipeline.brands} />

        {/* FILTERS — niches / statuts / canaux */}
        <div
          className="flex-shrink-0 px-6 py-2.5"
          style={{ borderBottom: "1px solid #EDE0D0" }}
        >
          <PipelineFilters
            filters={pipeline.filters}
            onFilterChange={(key, value) => pipeline.setFilter(key, value)}
          />
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-6 py-5">
          <div
            key={pipeline.view}
            className="animate-in fade-in-0 duration-200"
          >
            {pipeline.view === "kanban" ? (
              <KanbanView
                brands={pipeline.brands}
                onEdit={openEditDialog}
                onDelete={handleDeleteBrand}
                onHistory={openContactHistory}
                onStatusChange={(brandId, status) => {
                  pipeline.changeStatus(brandId, status);
                  toast.success("Statut mis à jour");
                }}
                onReorder={(dragId, targetId, position, status) => {
                  pipeline.reorderBrand(dragId, targetId, position, status);
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
                  toast.success("Statut mis à jour");
                }}
                onDragStart={pipeline.setDragged}
                needsFollowUp={pipeline.needsFollowUp}
              />
            )}
          </div>
        </main>
      </div>

      {/* Palette de commandes Cmd+K */}
      <CommandPalette
        brands={pipeline.allBrands}
        onOpenBrand={openEditDialog}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        query={paletteQuery}
        onQueryChange={setPaletteQuery}
        selectedIndex={paletteIndex}
        onSelectedIndexChange={setPaletteIndex}
      />

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
          if (selectedBrand) handleAddContact(selectedBrand.id, contact);
        }}
      />
    </div>
  );
}
