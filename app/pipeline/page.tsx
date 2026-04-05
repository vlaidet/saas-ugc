import { getRequiredUser } from "@/lib/auth/auth-user";
import { getBrandsByUserId } from "@/query/pipeline/get-brands";
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
  const user = await getRequiredUser();
  const brands = await getBrandsByUserId(user.id);
  return <PipelinePage initialBrands={brands} />;
}
