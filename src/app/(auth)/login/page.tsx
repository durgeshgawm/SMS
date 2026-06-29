"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { School, Eye, EyeOff, Loader2, AlertCircle, Sun, Moon, Key, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/use-auth-store";
import { useThemeStore } from "@/store/use-theme-store";
import { UserRole } from "@/types/common";
import { toast } from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod.string().min(4, { message: "Password must be at least 4 characters" }),
});

type LoginSchemaType = zod.infer<typeof loginSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
} as const;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showQuickFill, setShowQuickFill] = useState(false);

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative backdrop-blur-xl bg-white/75 dark:bg-slate-900/75 text-card-foreground border border-white/40 dark:border-slate-800/40 rounded-3xl p-8 shadow-2xl space-y-6 overflow-hidden transition-all duration-300"
    >
      {/* Decorative gradient glowing bar at the top */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-80" />

      {/* Interactive Sun/Moon theme toggler */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-xl bg-slate-200/50 hover:bg-slate-200/80 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-300/20 dark:border-slate-700/30 transition-all duration-200 active:scale-95 z-20"
        title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
      </button>

      {/* Header section with brand logo & titles */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 group">
          <School className="h-7 w-7 animate-pulse" />
          <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-md -z-10 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xs font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">
            Greenwood Academy
          </h2>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 dark:from-indigo-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
            Sign In to SMS ERP
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto">
            Access your administrative portal and school management panel.
          </p>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <motion.div variants={itemVariants} className="space-y-1.5 w-full text-left">
              <Label htmlFor="email-field" className="text-xs font-semibold text-foreground">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email-field"
                type="email"
                placeholder="e.g. teacher@school.com"
                required
                autoComplete="email"
                className="h-10 border-slate-200 dark:border-slate-800/80 bg-white/45 dark:bg-slate-950/45 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all rounded-xl text-xs"
                {...methods.register("email")}
              />
              {methods.formState.errors.email && (
                <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {methods.formState.errors.email.message?.toString()}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5 w-full text-left relative">
              <Label htmlFor="password-field" className="text-xs font-semibold text-foreground">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-10 border-slate-200 dark:border-slate-800/80 bg-white/45 dark:bg-slate-950/45 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all rounded-xl text-xs pr-10"
                  {...methods.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {methods.formState.errors.password && (
                <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {methods.formState.errors.password.message?.toString()}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-slate-200 dark:border-slate-800/80 bg-white/45 dark:bg-slate-950/45 text-indigo-600 focus:ring-indigo-500/30 h-4 w-4 transition-colors"
                />
                <span className="text-slate-500 dark:text-slate-400">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <Button type="submit" disabled={loading} className="w-full h-11 font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing you in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </FormProvider>

      {/* Reviewer Auto-fill credentials selector dropdown panel */}
      <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 text-left">
        <button
          type="button"
          onClick={() => setShowQuickFill(!showQuickFill)}
          className="flex items-center justify-between w-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Key className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Reviewer Quick Fill Accounts
            </span>
          </div>
          {showQuickFill ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {showQuickFill && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1 text-slate-700 dark:text-slate-300">
                {[
                  { label: "Super Admin", email: "superadmin@school.com", color: "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/20" },
                  { label: "Branch Admin", email: "branchadmin@school.com", color: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/20" },
                  { label: "Academic Head", email: "academic@school.com", color: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20" },
                  { label: "Finance Manager", email: "finance@school.com", color: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
                  { label: "HR Manager", email: "hr@school.com", color: "bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/20" },
                  { label: "Librarian", email: "library@school.com", color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20" },
                  { label: "Transport Admin", email: "transport@school.com", color: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
                  { label: "Hostel Warden", email: "hostel@school.com", color: "bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/20" },
                  { label: "Educator (Teacher)", email: "teacher@school.com", color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20" },
                  { label: "Student", email: "student@school.com", color: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/20" },
                  { label: "Parent", email: "parent@school.com", color: "bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/20" },
                ].map((acc) => (
                  <button
                    key={acc.label}
                    type="button"
                    onClick={() => {
                      methods.setValue("email", acc.email);
                      methods.setValue("password", "admin");
                      toast.info(`Filled form with ${acc.label} credentials!`);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-all border text-left flex items-center justify-between ${acc.color}`}
                  >
                    <span>{acc.label}</span>
                    <span className="opacity-40 text-[8px] font-normal truncate max-w-[90px]">{acc.email.split("@")[0]}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
