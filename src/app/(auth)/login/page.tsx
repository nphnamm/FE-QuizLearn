"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialLogin } from "@/components/auth/social-login";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginMutation } from "../../../../redux/features/auth/authApi";
import { useLoadUserQuery } from "../../../../redux/features/api/apiSlice";
import { useSelector } from "react-redux";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isError, data, isSuccess, error }] = useLoginMutation();
  const { user } = useSelector((state: any) => state.auth);

  // Wrap searchParams related code in a client component
  function SearchParamsHandler() {
    const searchParams = useSearchParams();
    
    useEffect(() => {
      if (searchParams?.get("registered")) {
        toast.success("Registration successful! Please sign in.");
      }
      if (searchParams?.get("reset")) {
        toast.success("Password reset successful! Please sign in.");
      }
    }, [searchParams]);
    
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // console.log(email, password);
    try {
      await login({ email, password });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Login successfully!");
      router.push("/dashboard");
    }
    if(!!user && user !== ""){
      router.push("/dashboard");
    }
  }, [isSuccess, isError]);
  // Handle click outside modal
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-100 to-primary-200 dark:bg-black">
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent dark:from-zinc-800/20 pointer-events-none" />
      <div className="w-full max-w-md px-4 z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-2">
            QuizLearn
          </h1>
          <p className="text-primary-700 dark:text-zinc-400">
            Your Learning Journey Starts Here
          </p>
        </div>

        <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 shadow-custom dark:border-zinc-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-primary-800 dark:text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-primary-600 dark:text-zinc-400">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-primary-700 dark:text-zinc-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="border-primary-200 focus:border-primary-500 focus:ring-primary-500 dark:bg-zinc-800 dark:border-zinc-700 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 dark:text-white dark:placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-primary-700 dark:text-zinc-300"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="border-primary-200 focus:border-primary-500 focus:ring-primary-500 dark:bg-zinc-800 dark:border-zinc-700 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 dark:text-white"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 border border-input text-dark dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black transition-colors"
              >
                Sign in
              </Button>
              <SocialLogin />
              <div className="text-sm text-center space-y-2">
                <div className="text-primary-600 dark:text-zinc-400">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary-700 hover:text-primary-800 dark:text-zinc-300 dark:hover:text-white font-semibold hover:underline"
                  >
                    Create one
                  </Link>
                </div>
                <div>
                  <Link
                    href="/forgot-password"
                    className="text-primary-600 hover:text-primary-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
