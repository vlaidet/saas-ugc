"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Brand, ContactEntry, ContactChannel, BrandNiche } from "../types";
import { CHANNELS } from "../constants";
import { BrandAvatar } from "./brand-avatar";
import { Clock, MessageSquarePlus } from "lucide-react";

interface ContactHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand | null;
  onAddContact: (contact: Omit<ContactEntry, "id">) => void;
}

const warmSelectContent =
  "rounded-xl border-[#EDE0D0] bg-white p-1.5 shadow-2xl shadow-[#3D2314]/10 animate-in fade-in-0 zoom-in-95 duration-150";

const warmSelectItem =
  "rounded-lg pl-3 pr-8 py-2 text-sm font-medium cursor-pointer transition-colors duration-100 focus:bg-[#FAF6F1] focus:text-[#3D2314] text-[#6B4226]";

const inputClass =
  "w-full rounded-xl border border-[#EDE0D0] bg-[#FAF6F1] px-3 py-2 text-sm text-[#3D2314] outline-none transition-all duration-150 placeholder:text-[#C9BEB2] focus:border-[#C4621D] focus:bg-white focus:ring-1 focus:ring-[#C4621D]/20";

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

    setDate(new Date().toISOString().split("T")[0]);
    setChannel("");
    setMessage("");
    setResponse("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-xl overflow-y-auto rounded-2xl border-[#EDE0D0] bg-white p-0 shadow-2xl"
        style={{ boxShadow: "0 24px 64px rgba(61,35,20,0.14)" }}
      >
        {/* Header */}
        <DialogHeader
          className="px-6 pt-6 pb-4"
          style={{ borderBottom: "1px solid #F0E8DF" }}
        >
          <div className="flex items-center gap-3">
            <BrandAvatar
              name={brand.name}
              niche={brand.niche as unknown as BrandNiche}
              size="md"
            />
            <div>
              <DialogTitle
                className="text-base font-bold"
                style={{ color: "#3D2314" }}
              >
                {brand.name}
              </DialogTitle>
              <p className="mt-0.5 text-xs" style={{ color: "#A89880" }}>
                {brand.niche}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-0">
          {/* Historique */}
          {brand.contacts.length > 0 && (
            <div className="px-6 py-5">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" style={{ color: "#A89880" }} />
                <h3
                  className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "#A89880" }}
                >
                  Historique ({brand.contacts.length})
                </h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {brand.contacts.map((contact) => {
                  const formattedDate = new Date(
                    contact.date,
                  ).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={contact.id}
                      className="rounded-xl p-3.5"
                      style={{
                        backgroundColor: "#FAF6F1",
                        border: "1px solid #F0E8DF",
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className="rounded-md px-2 py-0.5 text-xs font-semibold"
                          style={{
                            backgroundColor: "#EDE0D0",
                            color: "#6B4226",
                          }}
                        >
                          {contact.channel}
                        </span>
                        <span className="text-xs" style={{ color: "#A89880" }}>
                          {formattedDate}
                        </span>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#3D2314" }}
                      >
                        {contact.message}
                      </p>
                      {contact.response && (
                        <div
                          className="mt-2.5 rounded-lg border-l-2 py-2 pr-2 pl-3"
                          style={{
                            borderColor: "#C4621D",
                            backgroundColor: "#FDF8F4",
                          }}
                        >
                          <p
                            className="mb-0.5 text-xs font-medium"
                            style={{ color: "#C4621D" }}
                          >
                            Réponse reçue
                          </p>
                          <p className="text-sm" style={{ color: "#6B4226" }}>
                            {contact.response}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Séparateur */}
          {brand.contacts.length > 0 && (
            <div
              style={{
                height: "1px",
                backgroundColor: "#F0E8DF",
                margin: "0 24px",
              }}
            />
          )}

          {/* Ajouter un contact */}
          <div className="px-6 py-5">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquarePlus
                className="h-3.5 w-3.5"
                style={{ color: "#C4621D" }}
              />
              <h3
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "#A89880" }}
              >
                Nouveau contact
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                    style={{ color: "#A89880" }}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                    style={{ color: "#A89880" }}
                  >
                    Canal
                  </label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger
                      className="h-9 w-full rounded-xl border-[#EDE0D0] text-sm transition-all duration-150 focus:border-[#C4621D] focus:ring-1 focus:ring-[#C4621D]/20"
                      style={{
                        color: channel ? "#3D2314" : "#C9BEB2",
                        backgroundColor: "#FAF6F1",
                      }}
                    >
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent className={warmSelectContent}>
                      {CHANNELS.map((ch) => (
                        <SelectItem
                          key={ch}
                          value={ch}
                          className={warmSelectItem}
                        >
                          {ch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "#A89880" }}
                >
                  Message envoyé
                </label>
                <textarea
                  placeholder="Décrivez votre prise de contact..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className={inputClass}
                  style={{ resize: "none" }}
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "#A89880" }}
                >
                  Réponse reçue{" "}
                  <span
                    className="font-normal normal-case"
                    style={{ color: "#C9BEB2" }}
                  >
                    (optionnel)
                  </span>
                </label>
                <textarea
                  placeholder="La marque a répondu..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={2}
                  className={inputClass}
                  style={{ resize: "none" }}
                />
              </div>

              <button
                onClick={handleAddContact}
                disabled={!channel || !message}
                className="mt-1 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  backgroundColor: "#C4621D",
                  boxShadow: "0 2px 8px rgba(196,98,29,0.25)",
                }}
              >
                Enregistrer le contact
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
