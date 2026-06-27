"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { School, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/forms";
import { useAuthStore } from "@/store/use-auth-store";
import { UserRole } from "@/types/common";
import { toast } from "@/components/ui/toast";

const loginSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod.string().min(4, { message: "Password must be at least 4 characters" }),
});

type LoginSchemaType = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "superadmin@school.com",
      password: "admin",
    },
  });

  const getRoleFromEmail = (email: string): UserRole => {
    const clean = email.toLowerCase().trim();
    if (clean.includes("superadmin") || clean.includes("super-admin")) return "super-admin";
    if (clean.includes("branchadmin") || clean.includes("branch-admin")) return "branch-admin";
    if (clean.includes("academic")) return "academic";
    if (clean.includes("finance")) return "finance";
    if (clean.includes("hr")) return "hr";
    if (clean.includes("library")) return "library";
    if (clean.includes("transport")) return "transport";
    if (clean.includes("hostel")) return "hostel";
    if (clean.includes("teacher")) return "teacher";
    if (clean.includes("student")) return "student";
    if (clean.includes("parent")) return "parent";
    return "super-admin";
  };

  const getRoleName = (role: UserRole): string => {
    return role
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const onSubmit = (data: LoginSchemaType) => {
    setLoading(true);
    setTimeout(() => {
      const role = getRoleFromEmail(data.email);
      const name = `${getRoleName(role)} User`;

      login(data.email, role, name);

      toast.success(`Successfully logged in as ${name}!`);
      router.push(`/${role}/dashboard`);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="bg-card text-card-foreground border border-border/80 rounded-2xl p-8 shadow-xl space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6366f1] text-white shadow-md">
          <School className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Sign in to SMS ERP</h2>
        <p className="text-xs text-muted-foreground max-w-[280px]">
          Enter your institutional email address to login to your dashboard.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="email"
            label="Email Address"
            placeholder="e.g. teacher@school.com"
            required
            autoComplete="email"
          />

          <div className="space-y-1.5 w-full text-left relative">
            <Label htmlFor="password-field" className="text-xs font-semibold text-foreground">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password-field"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="h-9 border-border bg-card text-xs focus-visible:ring-primary pr-10"
                {...methods.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {methods.formState.errors.password && (
              <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {methods.formState.errors.password.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-border bg-card text-[#6366f1] focus:ring-primary h-3.5 w-3.5"
              />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="font-semibold text-[#6366f1] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-10 mt-2 font-semibold">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing you in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </FormProvider>

      <div className="border-t border-border/60 pt-4 text-left">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Reviewer Quick Fill Accounts</span>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {[
            { label: "Super Admin", email: "superadmin@school.com" },
            { label: "Branch Admin", email: "branchadmin@school.com" },
            { label: "Academic Head", email: "academic@school.com" },
            { label: "Finance Manager", email: "finance@school.com" },
            { label: "HR Manager", email: "hr@school.com" },
            { label: "Librarian", email: "library@school.com" },
            { label: "Transport Admin", email: "transport@school.com" },
            { label: "Hostel Warden", email: "hostel@school.com" },
            { label: "Educator (Teacher)", email: "teacher@school.com" },
            { label: "Student", email: "student@school.com" },
            { label: "Parent", email: "parent@school.com" },
          ].map((acc) => (
            <button
              key={acc.label}
              type="button"
              onClick={() => {
                methods.setValue("email", acc.email);
                methods.setValue("password", "admin");
                toast.info(`Filled form with ${acc.label} credentials!`);
              }}
              className="px-2.5 py-1 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-[10px] font-bold transition-all border border-border/60"
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
