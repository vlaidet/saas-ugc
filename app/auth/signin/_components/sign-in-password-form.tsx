"use client";

import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient } from "@/lib/auth-client";
import { getCallbackUrl } from "@/lib/auth/auth-utils";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

const LoginCredentialsFormScheme = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginCredentialsFormType = z.infer<typeof LoginCredentialsFormScheme>;

export const SignInPasswordForm = (props: {
  callbackUrl?: string;
  email?: string;
}) => {
  const signInMutation = useMutation({
    mutationFn: async (values: LoginCredentialsFormType) => {
      return unwrapSafePromise(
        authClient.signIn.email({
          email: values.email,
          password: values.password,
          rememberMe: true,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      const callbackUrl = getCallbackUrl(props.callbackUrl ?? "/pipeline");
      window.location.href = callbackUrl;
    },
  });

  const form = useForm({
    schema: LoginCredentialsFormScheme,
    defaultValues: {
      email: props.email ?? "",
      password: "",
    },
    onSubmit: async (values) => {
      await signInMutation.mutateAsync(values).catch(() => {
        // Error handled by mutation's onError
      });
    },
  });

  return (
    <Form form={form} className="max-w-lg space-y-4">
      <form.AppField name="email">
        {(field) => (
          <field.Field>
            <field.Label>Email</field.Label>
            <field.Content>
              <field.Input type="email" placeholder="vous@exemple.com" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="password">
        {(field) => (
          <field.Field className="flex-1">
            <div className="flex items-center justify-between">
              <field.Label>Mot de passe</field.Label>
              <Link
                href="/auth/forget-password"
                className="text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: "#C4621D" }}
                tabIndex={-1}
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <field.Content>
              <field.Input type="password" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.SubmitButton
        className="w-full cursor-pointer rounded-xl text-sm font-semibold text-white"
        style={{
          backgroundColor: "#C4621D",
          boxShadow: "0 1px 4px rgba(196,98,29,0.3)",
        }}
      >
        Se connecter
      </form.SubmitButton>
    </Form>
  );
};
