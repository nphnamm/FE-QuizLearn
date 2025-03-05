"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get("email") as string;
    setEmail(emailValue);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailValue }),
      });

      if (response.ok) {
        setStep("otp");
        toast.success("Reset code sent to your email");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to send reset email");
        toast.error(data.message || "Failed to send reset email");
      }
    } catch (err) {
      const message = "An error occurred while sending reset email";
      setError(message);
      toast.error(message);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Reset code resent to your email");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to resend code");
        toast.error(data.message || "Failed to resend code");
      }
    } catch (err) {
      const message = "An error occurred while resending code";
      setError(message);
      toast.error(message);
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      const message = "Please enter the complete verification code";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      if (response.ok) {
        setStep("reset");
        toast.success("Code verified successfully");
      } else {
        const data = await response.json();
        setError(data.message || "Invalid verification code");
        toast.error(data.message || "Invalid verification code");
      }
    } catch (err) {
      const message = "An error occurred during verification";
      setError(message);
      toast.error(message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      const message = "Passwords do not match";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otp.join(""),
          password,
        }),
      });

      if (response.ok) {
        toast.success("Password reset successfully");
        router.push("/login?reset=true");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to reset password");
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      const message = "An error occurred while resetting password";
      setError(message);
      toast.error(message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <form onSubmit={handleEmailSubmit}>
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
              {error && (
                <div className="text-sm text-red-500 text-center bg-red-50 dark:text-red-400 dark:bg-red-900/50 p-2 rounded dark:border dark:border-red-800">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black transition-colors"
              >
                Send Reset Code
              </Button>
              <div className="text-sm text-center text-primary-600 dark:text-zinc-400">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-primary-700 hover:text-primary-800 dark:text-zinc-300 dark:hover:text-white font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        );

      case "otp":
        return (
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
              {error && (
                <div className="text-sm text-red-500 text-center bg-red-50 dark:text-red-400 dark:bg-red-900/50 p-2 rounded dark:border dark:border-red-800">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={verifyOtp}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black transition-colors"
              >
                Verify Code
              </Button>
              <div className="text-sm text-center text-primary-600 dark:text-zinc-400">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  type="button"
                  className="text-primary-700 hover:text-primary-800 dark:text-zinc-300 dark:hover:text-white font-semibold hover:underline"
                >
                  Resend
                </button>
              </div>
            </CardFooter>
          </div>
        );

      case "reset":
        return (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-primary-700 dark:text-zinc-300"
                >
                  New Password
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
                  Confirm New Password
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
              {error && (
                <div className="text-sm text-red-500 text-center bg-red-50 dark:text-red-400 dark:bg-red-900/50 p-2 rounded dark:border dark:border-red-800">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black transition-colors"
              >
                Reset Password
              </Button>
            </CardFooter>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-100 to-primary-200 dark:bg-black">
      <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent dark:from-zinc-800/20 pointer-events-none" />

      <div className="w-full max-w-md px-4 z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-2">
            QuizLearn
          </h1>
          <p className="text-primary-700 dark:text-zinc-400">
            Reset Your Password
          </p>
        </div>

        <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 shadow-custom dark:border-zinc-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-primary-800 dark:text-white">
              {step === "email" && "Forgot Password"}
              {step === "otp" && "Verify Your Email"}
              {step === "reset" && "Create New Password"}
            </CardTitle>
            <CardDescription className="text-center text-primary-600 dark:text-zinc-400">
              {step === "email" && "Enter your email to receive a reset code"}
              {step === "otp" && "Enter the 6-digit code sent to your email"}
              {step === "reset" && "Enter your new password"}
            </CardDescription>
          </CardHeader>
          {renderStep()}
        </Card>
      </div>
    </div>
  );
}
