"use client";

import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import type { BrandNiche, ContactChannel } from "@/features/pipeline/types";
import { useTemplates } from "./use-templates";
import type { MessageTemplate } from "./types";
import { TemplateStats } from "./components/template-stats";
import { TemplateFilters } from "./components/template-filters";
import { TemplateCard } from "./components/template-card";
import { TemplateFormDialog } from "./components/template-form-dialog";
import { TemplateUsePanel } from "./components/template-use-panel";

type TemplateFormData = {
  title: string;
  channel: ContactChannel;
  niche: BrandNiche;
  content: string;
};

export function TemplatesPage() {
  const store = useTemplates();

  // Dialog de création / édition
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<MessageTemplate | null>(null);

  // Panel "Utiliser ce template"
  const [usePanelOpen, setUsePanelOpen] = useState(false);
  const [usingTemplate, setUsingTemplate] = useState<MessageTemplate | null>(
    null,
  );

  const handleCreate = (data: TemplateFormData) => {
    store.addTemplate(data);
    toast.success("Template créé");
    setFormOpen(false);
    setEditingTemplate(null);
  };

  const handleEdit = (data: TemplateFormData) => {
    if (!editingTemplate) return;
    store.updateTemplate(editingTemplate.id, data);
    toast.success("Template mis à jour");
    setFormOpen(false);
    setEditingTemplate(null);
  };

  const handleDelete = (id: string) => {
    dialogManager.confirm({
      title: "Supprimer le template",
      description:
        "Êtes-vous sûr ? Les statistiques seront perdues. Cette action est irréversible.",
      variant: "destructive",
      action: {
        label: "Supprimer",
        onClick: async () => {
          store.deleteTemplate(id);
          toast.success("Template supprimé");
        },
      },
    });
  };

  const handleDuplicate = (id: string) => {
    store.duplicateTemplate(id);
    toast.success("Template dupliqué");
  };

  const handleMarkReplied = (id: string) => {
    store.incrementReplied(id);
    toast.success("Réponse comptabilisée");
  };

  const handleUse = (template: MessageTemplate) => {
    setUsingTemplate(template);
    setUsePanelOpen(true);
  };

  const handleUsed = (id: string) => {
    store.incrementUsed(id);
  };

  const openEdit = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingTemplate(null);
    setFormOpen(true);
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: "#FAF6F1" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex flex-shrink-0 items-center gap-3 px-6 py-3"
        style={{
          backgroundColor: "rgba(250,246,241,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #EDE0D0",
        }}
      >
        <SidebarTrigger className="flex-shrink-0" />

        <div className="flex flex-shrink-0 items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#C4621D" }}
          >
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1
              className="text-base leading-none font-bold"
              style={{ color: "#3D2314" }}
            >
              Templates de Messages
            </h1>
            <p
              className="mt-0.5 text-xs leading-none"
              style={{ color: "#A89880" }}
            >
              Vos modèles de prospection
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <button
          onClick={openCreate}
          className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
          style={{
            backgroundColor: "#C4621D",
            boxShadow: "0 1px 4px rgba(196,98,29,0.3)",
          }}
        >
          <Plus className="h-4 w-4" />
          Nouveau template
        </button>
      </header>

      {/* Contenu scrollable */}
      <div className="flex flex-1 flex-col overflow-auto">
        <TemplateStats templates={store.allTemplates} />

        <TemplateFilters
          filters={store.filters}
          sortBy={store.sortBy}
          onFilterChange={store.setFilter}
          onSortChange={store.setSortBy}
        />

        {/* Grille de templates */}
        <main className="flex-1 px-6 py-5">
          {store.templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "#EDE0D0" }}
              >
                <FileText className="h-8 w-8" style={{ color: "#A89880" }} />
              </div>
              <div className="text-center">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#3D2314" }}
                >
                  Aucun template trouvé
                </p>
                <p className="mt-1 text-xs" style={{ color: "#A89880" }}>
                  {store.allTemplates.length > 0
                    ? "Essayez de modifier vos filtres"
                    : "Créez votre premier template de prospection"}
                </p>
              </div>
              {store.allTemplates.length === 0 && (
                <button
                  onClick={openCreate}
                  className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#C4621D" }}
                >
                  Créer un template
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {store.templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={handleUse}
                  onEdit={openEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onMarkReplied={handleMarkReplied}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Dialog création / édition */}
      <TemplateFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingTemplate ? handleEdit : handleCreate}
        defaultValues={editingTemplate}
        customVariables={store.customVariables}
        onAddCustomVariable={store.addCustomVariable}
        onDeleteCustomVariable={store.deleteCustomVariable}
      />

      {/* Panel latéral "Utiliser ce template" */}
      <TemplateUsePanel
        template={usingTemplate}
        open={usePanelOpen}
        onOpenChange={setUsePanelOpen}
        onUsed={handleUsed}
        customVariables={store.customVariables}
      />
    </div>
  );
}
