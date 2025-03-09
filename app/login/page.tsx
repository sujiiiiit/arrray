import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/app/login/login-form";
import { getUser } from "../../lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default async function AuthenticationPage() {
  const user = await getUser();
  if (user) {
    redirect("/");
  }

  return (
    <>
      <div className=" relative flex h-dvh flex-col items-center justify-center px-4 wdvw overflow-hidden ">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-sm px-4">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login with
            </h1>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
