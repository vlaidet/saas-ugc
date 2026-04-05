"use client";

import { TemplatesPage } from "@/features/templates/templates-page";
import type {
  MessageTemplate,
  CustomVariable,
} from "@/features/templates/types";

type MessagesPageProps = {
  initialTemplates: MessageTemplate[];
  initialCustomVariables: CustomVariable[];
};

export function MessagesPage({
  initialTemplates,
  initialCustomVariables,
}: MessagesPageProps) {
  return (
    <TemplatesPage
      initialTemplates={initialTemplates}
      initialCustomVariables={initialCustomVariables}
    />
  );
}
