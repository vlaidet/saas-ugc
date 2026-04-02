import { getRequiredUser } from "@/lib/auth/auth-user";
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
  await getRequiredUser();
  return <MessagesPage />;
}
