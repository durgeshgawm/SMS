"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { FormWizardTemplate } from "@/components/templates/form-wizard";
import { FormInput, FormSelect, FormSwitch } from "@/components/forms";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

export default function AddStudentPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const router = useRouter();

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const wizardSteps = [
    {
      title: "Basic Profile",
      description: "Primary student information and contact details.",
      fields: (
        <>
          <FormInput name="name" label="Student Full Name" required placeholder="e.g. Aditya Sen" />
          <FormInput name="email" label="Student Email" required placeholder="e.g. aditya.s@school.com" />
          <FormInput name="phone" label="Contact Phone Number" required placeholder="e.g. 9876543210" />
          <FormSelect
            name="gender"
            label="Gender Identity"
            required
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          />
        </>
      ),
    },
    {
      title: "Academic Cohorts",
      description: "Assigned class levels, roll number, and school branch campus.",
      fields: (
        <>
          <FormInput name="class" label="Assigned Class Level" required placeholder="e.g. Class 10" />
          <FormInput name="rollNo" label="Roll Number" required placeholder="e.g. 23" />
          <FormInput name="admissionNo" label="Admission Register No" required placeholder="e.g. GW-2026-9024" />
          <FormSelect
            name="branchId"
            label="Selected Branch Campus"
            options={[
              { value: "br-delhi", label: "Delhi Main Branch" },
              { value: "br-mumbai", label: "Mumbai Campus" },
              { value: "br-chennai", label: "Chennai Campus" },
            ]}
          />
        </>
      ),
    },
    {
      title: "Guardian & Notifications",
      description: "Emergency contacts and automated notifications settings.",
      fields: (
        <>
          <FormInput name="fatherName" label="Guardian Full Name" placeholder="e.g. Rajesh Sen" />
          <FormInput name="fatherPhone" label="Guardian Phone No" placeholder="e.g. 9123456780" />
          <FormSwitch
            name="smsConsent"
            label="Enable Automated SMS Alerts"
            description="Send instant notifications for attendance and billing direct to parent's phone."
          />
        </>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    toast.success("Student profile compiled and enrolled successfully!");
    router.push(`/${role}/students`);
  };

  const handleCancel = () => {
    router.push(`/${role}/students`);
  };

  return (
    <FormWizardTemplate
      title="Enroll New Student"
      description="Interactive multi-step wizard to compile credentials and register a new student."
      steps={wizardSteps}
      defaultValues={{
        smsConsent: true,
        gender: "male",
        branchId: "br-delhi",
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
