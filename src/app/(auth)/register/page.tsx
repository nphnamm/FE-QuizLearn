"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  useActivationMutation,
  useRegistrationMutation,
} from "../../../../redux/features/auth/authApi";
import { useSelector } from "react-redux";

export default function RegisterPage() {
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [register, { isError, data, isSuccess, error }] =
    useRegistrationMutation();
  const [activation, { isSuccess: activationSuccess, error: activationError }] =
    useActivationMutation();
  const { token } = useSelector((state: any) => state.auth);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const data = {
        email,
        password,
      };
      await register(data);
    } catch (err) {
      toast.error("An error occurred during registration");
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete verification code");
      return;
    }

    try {
      console.log("token", token);
      console.log("otpValue", otpValue);
      await activation({
        activation_token: token,
        activation_code: otpValue,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration Successfully";
      toast.success(message);
      setIsOtpSent(true);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (activationSuccess) {
      toast.success("Account Activated successfully");

      router.push("/login");
    }
    if (activationError) {
      if ("data" in activationError) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      } else {
        // console.log('An error occured', error);
      }
    }
  }, [activationSuccess, activationError]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-100 to-primary-200 dark:bg-black">
      <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent dark:from-zinc-800/20 pointer-events-none" />

      <div className="w-full max-w-md px-4 z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-2">
            QuizLearn
          </h1>
          <p className="text-primary-700 dark:text-zinc-400">
            Join Our Learning Community
          </p>
        </div>

        <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 shadow-custom dark:border-zinc-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-primary-800 dark:text-white">
              {isOtpSent ? "Verify Your Email" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-center text-primary-600 dark:text-zinc-400">
              {isOtpSent
                ? "Enter the 6-digit code sent to your email"
                : "Enter your details to get started"}
            </CardDescription>
          </CardHeader>
          {!isOtpSent ? (
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
                    autoComplete="new-password"
                    className="border-primary-200 focus:border-primary-500 focus:ring-primary-500 dark:bg-zinc-800 dark:border-zinc-700 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-primary-700 dark:text-zinc-300"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="border-primary-200 focus:border-primary-500 focus:ring-primary-500 dark:bg-zinc-800 dark:border-zinc-700 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 dark:text-white"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black transition-colors"
                >
                  Create account
                </Button>
                <SocialLogin />
                <div className="text-sm text-center space-y-2">
                  <div className="text-primary-600 dark:text-zinc-400">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary-700 hover:text-primary-800 dark:text-zinc-300 dark:hover:text-white font-semibold hover:underline"
                    >
                      Sign in
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
          ) : (
            <div>
              <CardContent className="space-y-4">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg border-primary-200 focus:border-primary-500 focus:ring-primary-500 dark:bg-zinc-800 dark:border-zinc-700 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 dark:text-white"
                    />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  onClick={verifyOtp}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black transition-colors"
                >
                  Verify Email
                </Button>
                <div className="text-sm text-center text-primary-600 dark:text-zinc-400">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    className="text-primary-700 hover:text-primary-800 dark:text-zinc-300 dark:hover:text-white font-semibold hover:underline"
                  >
                    Resend
                  </button>
                </div>
              </CardFooter>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
