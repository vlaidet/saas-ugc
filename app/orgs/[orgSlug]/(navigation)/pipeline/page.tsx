import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { Suspense } from "react";
import PipelinePage from "@/features/pipeline/pipeline-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RoutePage />
    </Suspense>
  );
}

async function RoutePage() {
  await getRequiredCurrentOrgCache();
  return <PipelinePage />;
}
