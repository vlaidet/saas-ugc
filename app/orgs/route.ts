import { getServerUrl } from "@/lib/server-url";
import { NextResponse } from "next/server";

/**
 * Legacy redirect: /orgs → /pipeline
 */
export const GET = async () => {
  return NextResponse.redirect(`${getServerUrl()}/pipeline`);
};
