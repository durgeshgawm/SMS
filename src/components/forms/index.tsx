"use client";

import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Upload,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  Command as CommandIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useRouter } from "next/navigation";

// --- 1. FormInput ---
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  helperText?: string;
}

export function FormInput({ name, label, helperText, className, type = "text", ...props }: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn("space-y-1.5 w-full text-left", className)}>
      <Label htmlFor={name} className="text-xs font-semibold text-foreground">
        {label} {props.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        className={cn(
          "h-9 border-border bg-card text-xs focus-visible:ring-primary",
          error && "border-red-500 focus-visible:ring-red-500"
        )}
        {...register(name, { valueAsNumber: type === "number" ? true : undefined })}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error.message?.toString()}
        </p>
      )}
      {!error && helperText && <p className="text-[10px] text-muted-foreground">{helperText}</p>}
    </div>
  );
}

// --- 2. FormTextarea ---
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  helperText?: string;
}

export function FormTextarea({ name, label, helperText, className, ...props }: FormTextareaProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn("space-y-1.5 w-full text-left", className)}>
      <Label htmlFor={name} className="text-xs font-semibold text-foreground">
        {label} {props.required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={name}
        className={cn(
          "border-border bg-card text-xs focus-visible:ring-primary min-h-[80px]",
          error && "border-red-500 focus-visible:ring-red-500"
        )}
        {...register(name)}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error.message?.toString()}
        </p>
      )}
      {!error && helperText && <p className="text-[10px] text-muted-foreground">{helperText}</p>}
    </div>
  );
}

// --- 3. FormSelect ---
interface FormSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function FormSelect({ name, label, options, placeholder = "Select an option", required, className }: FormSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn("space-y-1.5 w-full text-left", className)}>
      <Label className="text-xs font-semibold text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <TriggerWrapper error={!!error}>
              <SelectTrigger className="h-9 border-border bg-card text-xs">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </TriggerWrapper>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && (
        <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}

const TriggerWrapper = ({ children, error }: { children: React.ReactNode; error: boolean }) => (
  <div className={cn(error && "[&>button]:border-red-500 [&>button]:focus:ring-red-500")}>
    {children}
  </div>
);

// --- 4. FormDatePicker ---
interface FormDatePickerProps {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
}

export function FormDatePicker({ name, label, required, className }: FormDatePickerProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn("space-y-1.5 w-full text-left", className)}>
      <Label className="text-xs font-semibold text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger
              className={cn(
                "inline-flex shrink-0 items-center justify-start rounded-lg border border-border bg-card text-xs font-normal whitespace-nowrap transition-all outline-none select-none w-full h-9 gap-1.5 px-3 hover:bg-muted/40 text-foreground text-left",
                !field.value && "text-muted-foreground",
                error && "border-red-500"
              )}
            >
              <CalendarIcon className="h-4 w-4 text-primary shrink-0 mr-1" />
              {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date?.toISOString())}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {error && (
        <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}

// --- 5. FormSwitch ---
interface FormSwitchProps {
  name: string;
  label: string;
  description?: string;
  className?: string;
}

export function FormSwitch({ name, label, description, className }: FormSwitchProps) {
  const { control } = useFormContext();

  return (
    <div className={cn("flex flex-row items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm text-left", className)}>
      <div className="space-y-0.5">
        <Label className="text-xs font-bold text-foreground">{label}</Label>
        {description && <p className="text-[10px] text-muted-foreground">{description}</p>}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        )}
      />
    </div>
  );
}

// --- 6. FormFileUpload (Mock Drag and Drop with progress animation) ---
interface FormFileUploadProps {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
}

export function FormFileUpload({ name, label, required, className }: FormFileUploadProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = (name: string, size: number, onChange: any) => {
    setIsUploading(true);
    setFileName(name);
    setFileSize((size / 1024).toFixed(1) + " KB");
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onChange(name); // Bind file name to form schema
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className={cn("space-y-1.5 w-full text-left", className)}>
      <Label className="text-xs font-semibold text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            <div
              className={cn(
                "flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 bg-card/40 hover:bg-muted/10 cursor-pointer transition-colors text-center relative",
                error && "border-red-500 bg-red-500/5"
              )}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) simulateUpload(file.name, file.size, field.onChange);
                }}
              />
              <Upload className="h-8 w-8 text-primary mb-2" />
              <p className="text-xs font-semibold text-foreground">Drag and drop file here</p>
              <p className="text-[10px] text-muted-foreground mt-1">PDF, PNG, JPG, or DOC up to 5MB</p>
            </div>

            {/* Upload Status Card */}
            {fileName && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <FileText className="h-7 w-7 text-primary shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-foreground truncate">{fileName}</p>
                    <span className="text-[9px] text-muted-foreground">{fileSize}</span>
                  </div>
                  {isUploading ? (
                    <div className="space-y-1">
                      <Progress value={uploadProgress} className="h-1.5 bg-muted" />
                      <span className="text-[9px] text-muted-foreground block text-right">{uploadProgress}% uploading...</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Upload complete
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setFileName("");
                    setFileSize("");
                    setUploadProgress(0);
                    field.onChange(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      />
      {error && (
        <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}

// --- 7. SearchBar (Command Palette global routing teleport) ---
export function SearchBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Listen to Cmd+K or Ctrl+K
  useKeyboardShortcut("k", () => setOpen((prev) => !prev));

  const items = [
    { label: "Super Admin Dashboard", href: "/super-admin/dashboard" },
    { label: "Branch Administration", href: "/super-admin/branch-management" },
    { label: "Lead Admissions CRM", href: "/super-admin/admission-crm" },
    { label: "Student Ledger", href: "/super-admin/students" },
    { label: "Branch Admin Dashboard", href: "/branch-admin/dashboard" },
    { label: "Academic Head Portal", href: "/academic/dashboard" },
    { label: "Finance Ledger", href: "/finance/dashboard" },
    { label: "Salary Payroll", href: "/finance/salary-payroll" },
    { label: "HR Manager Directory", href: "/hr/dashboard" },
    { label: "Librarian Catalog", href: "/library/dashboard" },
    { label: "Transport Fleet Logs", href: "/transport/dashboard" },
    { label: "Hostel Warden Portal", href: "/hostel/dashboard" },
    { label: "Teacher Timetable", href: "/teacher/dashboard" },
    { label: "Student Grade Portal", href: "/student/dashboard" },
    { label: "Parent Child Monitor", href: "/parent/dashboard" },
  ];

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative h-9 w-full max-w-[200px] justify-start bg-card border-border hover:bg-muted/40 text-muted-foreground text-xs rounded-lg"
      >
        <Search className="mr-2 h-4 w-4 shrink-0" />
        <span>Search actions...</span>
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[9px] font-medium opacity-100 sm:flex">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or route name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Navigations / Dashboards">
            {items.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
                className="text-xs cursor-pointer py-2.5"
              >
                <CommandIcon className="mr-2 h-4 w-4 text-primary" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
