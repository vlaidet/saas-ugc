import { getRequiredUser } from "@/lib/auth/auth-user";
import PipelinePage from "@/features/pipeline/pipeline-page";
import { Suspense } from "react";

export const metadata = {
  title: "Pipeline de Prospection",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RoutePage />
    </Suspense>
  );
}

async function RoutePage() {
  await getRequiredUser();
  return <PipelinePage />;
}
