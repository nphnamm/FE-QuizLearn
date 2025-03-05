"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { socialLogin } from "@/store/features/signIn/loginSlice";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export function SocialLogin() {
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/api/auth/google/callback&response_type=code&scope=email profile&access_type=offline`,
      "Google Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (
        event.data?.type === "social_login" &&
        event.data?.provider === "google"
      ) {
        popup?.close();
        dispatch(
          socialLogin({
            data: { provider: "google", token: event.data.token },
            callback: () => {
              console.log("Google login success");
            },
          })
        );
      }
    });
  };

  const handleGithubLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${window.location.origin}/api/auth/github/callback&scope=user:email`,
      "GitHub Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (
        event.data?.type === "social_login" &&
        event.data?.provider === "github"
      ) {
        popup?.close();
        dispatch(
          socialLogin({
            data: { provider: "github", token: event.data.token },
            callback: () => {
              console.log("Github login success");
            },
          })
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={handleGoogleLogin}
        >
          <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Google
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={handleGithubLogin}
        >
          <Github className="mr-2 h-5 w-5" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
