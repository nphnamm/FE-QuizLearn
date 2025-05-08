"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
import { signIn, useSession } from "next-auth/react";
interface SessionUser {
  email?: string;
  name?: string;
  image?: string;
  provider?: string | null;
}
export function SocialLogin() {
  const dispatch = useDispatch();
  const { data } = useSession();
  const socialUser = data?.user as SessionUser | undefined;
  console.log("socialUser", socialUser);

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
          onClick={() => signIn("google")}
          variant="outline"
          className="w-full flex items-center justify-center"
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
          onClick={() => signIn("github")}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <Github className="mr-2 h-5 w-5" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
