"use client";

import { useLocalStorage } from "react-use";
import { SignInWithEmailOTP } from "./_components/sign-in-otp-form";
import { SignInPasswordForm } from "./_components/sign-in-password-form";

export const SignInCredentialsAndEmailOTP = (props: {
  callbackUrl?: string;
}) => {
  const [isUsingCredentials, setIsUsingCredentials] = useLocalStorage(
    "sign-in-with-credentials",
    false,
  );

  if (!isUsingCredentials) {
    return (
      <div className="flex flex-col gap-3">
        <SignInWithEmailOTP callbackUrl={props.callbackUrl} />
        <p className="text-xs" style={{ color: "#A89880" }}>
          Préférez le mot de passe ?{" "}
          <button
            type="button"
            onClick={() => setIsUsingCredentials(true)}
            className="cursor-pointer font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "#C4621D" }}
          >
            Connexion par mot de passe
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <SignInPasswordForm callbackUrl={props.callbackUrl} />
      <p className="text-xs" style={{ color: "#A89880" }}>
        Connexion plus rapide ?{" "}
        <button
          type="button"
          onClick={() => setIsUsingCredentials(false)}
          className="cursor-pointer font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "#C4621D" }}
        >
          Connexion par code OTP
        </button>
      </p>
    </div>
  );
};
