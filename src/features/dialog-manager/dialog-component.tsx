"use client";

import { Typography } from "@/components/nowts/typography";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LoadingButton } from "../form/submit-button";
import { handleDialogAction, useDialogStore } from "./dialog-store";
import type { Dialog } from "./dialog-types";

export function DialogComponent(props: { dialog: Dialog }) {
  const { dialog } = props;
  const [confirmText, setConfirmText] = useState("");
  const [inputValue, setInputValue] = useState(
    dialog.type === "input" ? (dialog.input.defaultValue ?? "") : "",
  );

  if (dialog.type === "custom") {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>{dialog.children}</AlertDialogContent>
      </AlertDialog>
    );
  }

  const isConfirmDisabled =
    dialog.type === "confirm" && dialog.confirmText
      ? confirmText !== dialog.confirmText
      : false;

  const handleAction = async () => {
    await handleDialogAction(dialog.id, async () =>
      dialog.action.onClick?.(dialog.type === "input" ? inputValue : undefined),
    );
  };

  const handleCancel = async () => {
    if (dialog.cancel?.onClick) {
      await dialog.cancel.onClick();
    } else {
      useDialogStore.getState().removeDialog(dialog.id);
    }
  };

  const isDestructive = dialog.variant === "destructive";

  return (
    <AlertDialog open={true} onOpenChange={handleCancel}>
      <AlertDialogContent
        className="overflow-hidden rounded-2xl border-[#EDE0D0] p-0 shadow-2xl"
        style={{
          backgroundColor: "white",
          boxShadow: "0 24px 64px rgba(61,35,20,0.14)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ borderBottom: "1px solid #F0E8DF" }}
        >
          <AlertDialogHeader
            className={cn({
              "flex flex-col items-center gap-2": dialog.style === "centered",
            })}
          >
            {(dialog.icon || isDestructive) && (
              <div
                className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: isDestructive ? "#FEF2F2" : "#F5F0EB",
                }}
              >
                {dialog.icon ? (
                  <dialog.icon
                    className="size-5"
                    style={{ color: isDestructive ? "#DC2626" : "#6B4226" }}
                  />
                ) : (
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: "#DC2626" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </div>
            )}
            <AlertDialogTitle
              className="text-base font-bold"
              style={{ color: "#3D2314" }}
            >
              {dialog.title ?? ""}
            </AlertDialogTitle>
            {typeof dialog.description === "string" ? (
              <AlertDialogDescription
                className="text-sm leading-relaxed"
                style={{ color: "#A89880" }}
              >
                {dialog.description}
              </AlertDialogDescription>
            ) : (
              dialog.description
            )}
          </AlertDialogHeader>
        </div>

        {/* Body (confirm text / input) */}
        {dialog.type === "confirm" && dialog.confirmText && (
          <div className="space-y-2 px-6 pt-4">
            <Typography>
              Tapez <Typography variant="code">{dialog.confirmText}</Typography>{" "}
              pour confirmer.
            </Typography>
            <Input
              autoFocus
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  if (!dialog.loading && !isConfirmDisabled) {
                    void handleAction();
                  }
                }
              }}
            />
          </div>
        )}

        {dialog.type === "input" && (
          <div className="px-6 pt-4">
            <Label>{dialog.input.label}</Label>
            <Input
              value={inputValue}
              placeholder={dialog.input.placeholder}
              onChange={(e) => setInputValue(e.target.value)}
              ref={(ref) => ref?.focus()}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!dialog.loading && !isConfirmDisabled) {
                    void handleAction();
                  }
                }
              }}
            />
          </div>
        )}

        {/* Footer */}
        <AlertDialogFooter className="gap-2 px-6 pt-4 pb-5">
          <button
            disabled={dialog.loading}
            onClick={handleCancel}
            className="flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all duration-150 hover:opacity-80"
            style={{
              borderColor: "#EDE0D0",
              backgroundColor: "#F5F0EB",
              color: "#6B4226",
            }}
          >
            {dialog.cancel?.label ?? "Annuler"}
          </button>

          <LoadingButton
            loading={dialog.loading}
            disabled={dialog.loading || isConfirmDisabled}
            onClick={handleAction}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
            style={
              isDestructive
                ? {
                    backgroundColor: "#DC2626",
                    boxShadow: "0 2px 8px rgba(220,38,38,0.25)",
                  }
                : {
                    backgroundColor: "#C4621D",
                    boxShadow: "0 2px 8px rgba(196,98,29,0.25)",
                  }
            }
          >
            {dialog.action.label ?? "OK"}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
