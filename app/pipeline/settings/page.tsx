import { getRequiredUser } from "@/lib/auth/auth-user";
import { Suspense } from "react";
import { SettingsClient } from "./settings-client";

export const metadata = {
  title: "Paramètres",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SettingsPage />
    </Suspense>
  );
}

async function SettingsPage() {
  const user = await getRequiredUser();

  return (
    <SettingsClient
      defaultValues={{
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        emailVerified: user.emailVerified,
      }}
    />
  );
}
