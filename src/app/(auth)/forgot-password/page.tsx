"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Key, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";

const emailSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
});

type EmailSchemaType = zod.infer<typeof emailSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const emailMethods = useForm<EmailSchemaType>({
    resolver: zodResolver(emailSchema),
  });

  const onEmailSubmit = (data: EmailSchemaType) => {
    setLoading(true);
    setTimeout(() => {
      setEmail(data.email);
      setStep("otp");
      setLoading(false);
      toast.success("Verification code sent to your email!");
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input automatically
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const onOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const pin = otp.join("");
      // Accepting either 1234 or any 4 digit code for high-fidelity ease of use
      if (pin.length === 4) {
        setStep("success");
        toast.success("OTP Verified! Password reset successfully.");
      } else {
        toast.error("Invalid verification code. Enter a 4-digit code.");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="bg-card text-card-foreground border border-border/80 rounded-2xl p-8 shadow-xl space-y-6">
      {step === "email" && (
        <>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
              <Key className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Forgot Password</h2>
            <p className="text-xs text-muted-foreground max-w-[280px]">
              Enter your registered email address to receive a 4-digit verification code.
            </p>
          </div>

          <FormProvider {...emailMethods}>
            <form onSubmit={emailMethods.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormInput
                name="email"
                label="Email Address"
                placeholder="e.g. user@school.com"
                required
              />

              <Button type="submit" disabled={loading} className="w-full h-10 font-semibold">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </form>
          </FormProvider>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </Link>
          </div>
        </>
      )}

      {step === "otp" && (
        <>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
              <Key className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Enter Verification Code</h2>
            <p className="text-xs text-muted-foreground max-w-[280px]">
              We have sent a verification code to <span className="font-semibold">{email}</span>.
            </p>
          </div>

          <form onSubmit={onOtpVerify} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((val, idx) => (
                <Input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="h-12 w-12 text-center text-lg font-bold border-border bg-card rounded-lg focus-visible:ring-primary"
                  autoFocus={idx === 0}
                  required
                />
              ))}
            </div>

            <Button type="submit" disabled={loading} className="w-full h-10 font-semibold">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying OTP...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setStep("email")}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Change Email
            </button>
          </div>
        </>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center text-center space-y-6 py-4 animate-in zoom-in-95 duration-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">Password Reset Successful</h2>
            <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
              Your password has been successfully reset. You can now login using your new credentials.
            </p>
          </div>
          <Link href="/login" className="w-full">
            <Button className="w-full h-10 font-semibold">Go to Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
