"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";

interface Step {
  title: string;
  description?: string;
  fields: React.ReactNode;
}

interface FormWizardTemplateProps {
  title: string;
  description?: string;
  steps: Step[];
  defaultValues?: any;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
}

export function FormWizardTemplate({
  title,
  description,
  steps,
  defaultValues = {},
  onSubmit,
  onCancel,
}: FormWizardTemplateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm({
    defaultValues,
  });

  const isLastStep = currentStep === steps.length - 1;

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFormSubmit = (values: any) => {
    onSubmit(values);
    toast.success("Form wizard submitted successfully!");
  };

  return (
    <PageContainer>
      <PageHeader title={title} description={description} />

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm max-w-3xl mx-auto space-y-8">
        {/* Stepper Header */}
        <div className="flex items-center justify-between w-full border-b pb-6">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isActive = currentStep === idx;

            return (
              <div key={idx} className="flex items-center flex-1 last:flex-initial">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                      isCompleted && "bg-green-500 border-green-500 text-white",
                      isActive && "bg-primary border-primary text-white",
                      !isActive && !isCompleted && "bg-card border-border text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p
                      className={cn(
                        "text-xs font-bold leading-none",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {idx !== steps.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-4", isCompleted ? "bg-green-500" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Body */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4 text-left animate-in fade-in duration-200">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-foreground">{steps[currentStep].title}</h3>
                {steps[currentStep].description && (
                  <p className="text-xs text-muted-foreground">{steps[currentStep].description}</p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 pt-2">{steps[currentStep].fields}</div>
            </div>

            {/* Stepper Actions */}
            <div className="flex items-center justify-between border-t pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={currentStep === 0 ? onCancel : handleBack}
                className="h-9 text-xs"
              >
                {currentStep === 0 ? "Cancel" : "Back"}
              </Button>

              <div className="flex gap-2">
                {!isLastStep ? (
                  <Button type="button" size="sm" onClick={handleNext} className="h-9 text-xs">
                    Next Step
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button type="submit" size="sm" className="h-9 text-xs font-semibold">
                    Complete Submit
                  </Button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </PageContainer>
  );
}
