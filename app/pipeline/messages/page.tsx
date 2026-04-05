import { getRequiredUser } from "@/lib/auth/auth-user";
import {
  getTemplatesByUserId,
  getCustomVariablesByUserId,
} from "@/query/pipeline/get-templates";
import { MessagesPage } from "@/features/pipeline/messages-page";
import { Suspense } from "react";

export const metadata = {
  title: "Messages",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RoutePage />
    </Suspense>
  );
}

async function RoutePage() {
  const user = await getRequiredUser();
  const [templates, customVariables] = await Promise.all([
    getTemplatesByUserId(user.id),
    getCustomVariablesByUserId(user.id),
  ]);
  return (
    <MessagesPage
      initialTemplates={templates}
      initialCustomVariables={customVariables}
    />
  );
}
