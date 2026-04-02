"use client";
import { useEffect } from "react";
import { Check, Plus } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, Form } from "@/features/form/tanstack-form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Brand } from "../types";
import { NICHES, CHANNELS } from "../constants";

const brandSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  niche: z.string().min(1, "La niche est requise"),
  channel: z.string().min(1, "Le canal est requis"),
  profileUrl: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

type BrandFormData = z.infer<typeof brandSchema>;

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BrandFormData) => void;
  defaultValues?: Brand | null;
}

const warmSelectContent =
  "rounded-xl border-[#EDE0D0] bg-white p-1.5 shadow-2xl shadow-[#3D2314]/10 animate-in fade-in-0 zoom-in-95 duration-150";

const warmSelectItem =
  "rounded-lg pl-3 pr-8 py-2 text-sm font-medium cursor-pointer transition-colors duration-100 focus:bg-[#FAF6F1] focus:text-[#3D2314] text-[#6B4226]";

export function BrandFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: BrandFormDialogProps) {
  const isEditing = !!defaultValues;

  const form = useForm({
    schema: brandSchema,
    defaultValues: {
      name: defaultValues?.name ?? "",
      niche: defaultValues?.niche ?? "",
      channel: defaultValues?.channel ?? "",
      profileUrl: defaultValues?.profileUrl ?? "",
      email: defaultValues?.email ?? "",
      notes: defaultValues?.notes ?? "",
    },
    onSubmit: async (values) => {
      onSubmit(values);
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (open) {
      form.setFieldValue("name", defaultValues?.name ?? "");
      form.setFieldValue("niche", defaultValues?.niche ?? "");
      form.setFieldValue("channel", defaultValues?.channel ?? "");
      form.setFieldValue("profileUrl", defaultValues?.profileUrl ?? "");
      form.setFieldValue("email", defaultValues?.email ?? "");
      form.setFieldValue("notes", defaultValues?.notes ?? "");
    }
  }, [open, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="mt-6 mb-10 flex max-h-[calc(100vh-4rem)] max-w-md flex-col overflow-hidden rounded-2xl border-[#EDE0D0] bg-white p-0 shadow-2xl"
        style={{ boxShadow: "0 24px 64px rgba(61,35,20,0.14)" }}
      >
        {/* Header */}
        <DialogHeader
          className="px-6 pt-6 pb-4"
          style={{ borderBottom: "1px solid #F0E8DF" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#C4621D" }}
            >
              {isEditing ? "✎" : "+"}
            </div>
            <DialogTitle
              className="text-base font-bold"
              style={{ color: "#3D2314" }}
            >
              {isEditing ? "Modifier la marque" : "Ajouter une marque"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Form */}
        <Form form={form} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5 [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D4C4B0] [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="flex flex-col gap-4">
              <form.AppField name="name">
                {(field) => (
                  <field.Field>
                    <field.Label
                      className="text-xs font-semibold tracking-wide uppercase"
                      style={{ color: "#A89880" }}
                    >
                      Nom de la marque
                    </field.Label>
                    <field.Content>
                      <field.Input
                        placeholder="ex. Nike, Sephora..."
                        className="rounded-xl border-[#EDE0D0] text-sm transition-all duration-150 focus:border-[#C4621D] focus:ring-1 focus:ring-[#C4621D]/20"
                        style={{ color: "#3D2314", backgroundColor: "#FAF6F1" }}
                      />
                      <field.Message />
                    </field.Content>
                  </field.Field>
                )}
              </form.AppField>

              <div className="grid grid-cols-2 gap-3">
                <form.AppField name="niche">
                  {(field) => (
                    <field.Field>
                      <field.Label
                        className="text-xs font-semibold tracking-wide uppercase"
                        style={{ color: "#A89880" }}
                      >
                        Niche
                      </field.Label>
                      <field.Content>
                        <field.Select>
                          <SelectTrigger
                            className="rounded-xl border-[#EDE0D0] text-sm transition-all duration-150 focus:border-[#C4621D] focus:ring-1 focus:ring-[#C4621D]/20"
                            style={{
                              color: "#3D2314",
                              backgroundColor: "#FAF6F1",
                            }}
                          >
                            <SelectValue placeholder="Choisir..." />
                          </SelectTrigger>
                          <SelectContent className={warmSelectContent}>
                            {NICHES.map((niche) => (
                              <SelectItem
                                key={niche}
                                value={niche}
                                className={warmSelectItem}
                              >
                                {niche}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </field.Select>
                        <field.Message />
                      </field.Content>
                    </field.Field>
                  )}
                </form.AppField>

                <form.AppField name="channel">
                  {(field) => (
                    <field.Field>
                      <field.Label
                        className="text-xs font-semibold tracking-wide uppercase"
                        style={{ color: "#A89880" }}
                      >
                        Canal
                      </field.Label>
                      <field.Content>
                        <field.Select>
                          <SelectTrigger
                            className="rounded-xl border-[#EDE0D0] text-sm transition-all duration-150 focus:border-[#C4621D] focus:ring-1 focus:ring-[#C4621D]/20"
                            style={{
                              color: "#3D2314",
                              backgroundColor: "#FAF6F1",
                            }}
                          >
                            <SelectValue placeholder="Choisir..." />
                          </SelectTrigger>
                          <SelectContent className={warmSelectContent}>
                            {CHANNELS.map((channel) => (
                              <SelectItem
                                key={channel}
                                value={channel}
                                className={warmSelectItem}
                              >
                                {channel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </field.Select>
                        <field.Message />
                      </field.Content>
                    </field.Field>
                  )}
                </form.AppField>
              </div>

              <form.AppField name="email">
                {(field) => (
                  <field.Field>
                    <field.Label
                      className="text-xs font-semibold tracking-wide uppercase"
                      style={{ color: "#A89880" }}
                    >
                      Email
                    </field.Label>
                    <field.Content>
                      <field.Input
                        type="email"
                        placeholder="contact@brand.com"
                        className="rounded-xl border-[#EDE0D0] text-sm transition-all duration-150 focus:border-[#C4621D] focus:ring-1 focus:ring-[#C4621D]/20"
                        style={{ color: "#3D2314", backgroundColor: "#FAF6F1" }}
                      />
                      <field.Message />
                    </field.Content>
                  </field.Field>
                )}
              </form.AppField>

              <form.AppField name="profileUrl">
                {(field) => (
                  <field.Field>
                    <field.Label
                      className="text-xs font-semibold tracking-wide uppercase"
                      style={{ color: "#A89880" }}
                    >
                      Lien profil
                    </field.Label>
                    <field.Content>
                      <field.Input
                        placeholder="https://instagram.com/brand"
                        className="rounded-xl border-[#EDE0D0] text-sm transition-all duration-150 focus:border-[#C4621D] focus:ring-1 focus:ring-[#C4621D]/20"
                        style={{ color: "#3D2314", backgroundColor: "#FAF6F1" }}
                      />
                      <field.Message />
                    </field.Content>
                  </field.Field>
                )}
              </form.AppField>

              <form.AppField name="notes">
                {(field) => (
                  <field.Field>
                    <field.Label
                      className="text-xs font-semibold tracking-wide uppercase"
                      style={{ color: "#A89880" }}
                    >
                      Notes
                    </field.Label>
                    <field.Content>
                      <field.Textarea
                        placeholder="Notes personnelles, contexte..."
                        rows={3}
                        autoFocus={isEditing}
                        onFocus={(e) => {
                          if (isEditing) {
                            const len = e.target.value.length;
                            e.target.setSelectionRange(len, len);
                          }
                        }}
                        className="rounded-xl border-[#EDE0D0] text-sm transition-all duration-150 focus:border-[#C4621D] focus:ring-1 focus:ring-[#C4621D]/20"
                        style={{
                          color: "#3D2314",
                          backgroundColor: "#FAF6F1",
                          resize: "vertical",
                          width: "100%",
                          maxWidth: "100%",
                          maxHeight: "500px",
                          overflowX: "hidden",
                          overflowY: "auto",
                          wordBreak: "break-word",
                        }}
                      />
                      <field.Message />
                    </field.Content>
                  </field.Field>
                )}
              </form.AppField>
            </div>
          </div>

          {/* Footer fixe */}
          <div
            className="shrink-0 px-6 py-4"
            style={{ borderTop: "1px solid #F0E8DF" }}
          >
            <form.SubmitButton
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: "#C4621D",
                boxShadow: "0 2px 8px rgba(196,98,29,0.25)",
              }}
            >
              {isEditing ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Mettre à jour
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter la marque
                </>
              )}
            </form.SubmitButton>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
