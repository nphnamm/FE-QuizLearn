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
import { registerApi, verifyEmailApi } from "@/services/api/identityApi";
import userService from "@/services/identityService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { saveRegisterInfo, verificationEmail } from "@/store/features/signUp/signUpSlice";

export default function RegisterPage() {
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch();
  const { token ,user } = useSelector((state: RootState) => state.signUp);
  const { isLogin } = useSelector((state: RootState) => state.login);

  console.log(user)
  console.log(isLogin)
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
      const response = await userService.register({ email, password });
      console.log(response)
      if (response.success) {
        toast.success(response.message);
        dispatch(saveRegisterInfo(response));
        setIsOtpSent(true);

      } else {
        toast.error(response.message);
      }

    } catch (err) {
      toast.error("An error occurred during registration");
    }
  };
 

  const handleResendOtp = async () => {
    const formData = new FormData(
      document.querySelector("form") as HTMLFormElement
    );
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast.success("Verification code resent to your email");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to resend verification code");
      }
    } catch (err) {
      toast.error("An error occurred while resending verification code");
    }
  };
  console.log('token',token)

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete verification code");
      return;
    }

    try {
      console.log('token',token)
      console.log('otpValue',otpValue)
      const response = await userService.verifyEmail({ activation_code: otpValue,activation_token:token });

      if (response.success) {
        toast.success("Email verified successfully!");
        dispatch(verificationEmail(response.data));
        router.push("/");
      } else {
        const data = response.data;
        toast.error(data.message || "Verification failed");
      }
    } catch (err) {
      toast.error("An error occurred during verification");
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
                    onClick={handleResendOtp}
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
