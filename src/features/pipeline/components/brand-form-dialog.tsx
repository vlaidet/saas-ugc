"use client";
import { useState, useEffect } from "react";
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

  // Reset form when opening or defaultValues changes
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la marque" : "Ajouter une marque"}
          </DialogTitle>
        </DialogHeader>

        <Form form={form} className="flex flex-col gap-4">
          <form.AppField name="name">
            {(field) => (
              <field.Field>
                <field.Label>Nom</field.Label>
                <field.Content>
                  <field.Input placeholder="ex. Nike" />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="niche">
            {(field) => (
              <field.Field>
                <field.Label>Niche</field.Label>
                <field.Content>
                  <field.Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {NICHES.map((niche) => (
                        <SelectItem key={niche} value={niche}>
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
                <field.Label>Canal de contact</field.Label>
                <field.Content>
                  <field.Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un canal" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNELS.map((channel) => (
                        <SelectItem key={channel} value={channel}>
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

          <form.AppField name="email">
            {(field) => (
              <field.Field>
                <field.Label>Email</field.Label>
                <field.Content>
                  <field.Input type="email" placeholder="contact@brand.com" />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="profileUrl">
            {(field) => (
              <field.Field>
                <field.Label>Lien profil</field.Label>
                <field.Content>
                  <field.Input placeholder="https://instagram.com/brand" />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="notes">
            {(field) => (
              <field.Field>
                <field.Label>Notes</field.Label>
                <field.Content>
                  <field.Textarea
                    placeholder="Notes personnelles..."
                    rows={3}
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          <form.SubmitButton className="w-full">
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </form.SubmitButton>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
