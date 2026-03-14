"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Brand, ContactEntry, ContactChannel } from "../types";
import { CHANNELS } from "../constants";
import { BrandAvatar } from "./brand-avatar";

interface ContactHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand | null;
  onAddContact: (contact: Omit<ContactEntry, "id">) => void;
}

export function ContactHistoryDialog({
  open,
  onOpenChange,
  brand,
  onAddContact,
}: ContactHistoryDialogProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [channel, setChannel] = useState<string>("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  if (!brand) return null;

  const handleAddContact = () => {
    if (!channel || !message) return;

    onAddContact({
      date: new Date(date).toISOString(),
      channel: channel as ContactChannel,
      message,
      response: response || undefined,
    });

    // Reset form
    setDate(new Date().toISOString().split("T")[0]);
    setChannel("");
    setMessage("");
    setResponse("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <BrandAvatar name={brand.name} niche={brand.niche} size="md" />
            <div>
              <DialogTitle>{brand.name}</DialogTitle>
              <p className="text-sm text-gray-600">{brand.niche}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Historique des contacts */}
          {brand.contacts.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Historique des contacts
              </h3>
              <div className="space-y-3">
                {brand.contacts.map((contact) => {
                  const contactDate = new Date(contact.date);
                  const formattedDate = contactDate.toLocaleDateString("fr-FR");

                  return (
                    <div
                      key={contact.id}
                      className="rounded-lg bg-gray-50 p-3 text-sm"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">{contact.channel}</span>
                        <span className="text-gray-600">{formattedDate}</span>
                      </div>
                      <p className="text-gray-700">{contact.message}</p>
                      {contact.response && (
                        <div className="mt-2 border-l-2 border-gray-300 pl-3">
                          <p className="text-sm text-gray-600 italic">
                            Réponse: {contact.response}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ajouter un contact */}
          <div className="border-t pt-4">
            <h3 className="mb-3 text-sm font-semibold">Ajouter un contact</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Canal</label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un canal" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((ch) => (
                      <SelectItem key={ch} value={ch}>
                        {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Message
                </label>
                <Textarea
                  placeholder="Décrivez votre contact..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Réponse (optionnel)
                </label>
                <Textarea
                  placeholder="Réponse reçue..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleAddContact}
                disabled={!channel || !message}
                className="w-full"
              >
                Ajouter le contact
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
