"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { FormWizardTemplate } from "@/components/templates/form-wizard";
import { FormInput, FormSelect, FormSwitch } from "@/components/forms";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

export default function EnrollEmployeePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const router = useRouter();

  if (role !== "super-admin" && role !== "hr" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const wizardSteps = [
    {
      title: "Basic Profile",
      description: "Primary employee contact details and name identifiers.",
      fields: (
        <>
          <FormInput name="name" label="Staff Full Name" required placeholder="e.g. Ms. Shalini Gupta" />
          <FormInput name="email" label="Institutional Email" required placeholder="e.g. shalini.g@school.com" />
          <FormInput name="phone" label="Contact Mobile Number" required placeholder="e.g. 9876543210" />
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
      title: "Employment Details",
      description: "Staff ID, role, department allocation, and starting base wage.",
      fields: (
        <>
          <FormInput name="employeeNo" label="Staff ID Code" required placeholder="e.g. GW-EMP-102" />
          <FormSelect
            name="role"
            label="System Role Allocation"
            required
            options={[
              { value: "teacher", label: "Educator (Teacher)" },
              { value: "academic", label: "Academic Head" },
              { value: "finance", label: "Finance Manager" },
              { value: "hr", label: "HR Manager" },
            ]}
          />
          <FormInput name="department" label="Department" required placeholder="e.g. Academics" />
          <FormInput name="designation" label="Designation Title" required placeholder="e.g. Senior Mathematics Lecturer" />
          <FormInput name="salary" label="Monthly Base Salary (₹)" type="number" required placeholder="e.g. 75000" />
        </>
      ),
    },
    {
      title: "Bank & Tax Details",
      description: "Salary disbursement bank details and document verification consents.",
      fields: (
        <>
          <FormInput name="bankAccount" label="Salary Disbursement Bank A/C" required placeholder="e.g. 98421058312" />
          <FormInput name="ifscCode" label="IFSC Code" required placeholder="e.g. SBIN0001428" />
          <FormInput name="panNo" label="PAN Card Card Registration" required placeholder="e.g. ABCDE1234F" />
          <FormSwitch
            name="salarySlipConsent"
            label="Automated Email Payslips"
            description="Send monthly generated payslips automatically to staff email address."
          />
        </>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    toast.success("Employee profile registered and payroll initialized successfully!");
    router.push(`/${role}/employees`);
  };

  const handleCancel = () => {
    router.push(`/${role}/employees`);
  };

  return (
    <FormWizardTemplate
      title="Enroll New Employee"
      description="Interactive multi-step wizard to register employee credentials, tax information, and bank channels."
      steps={wizardSteps}
      defaultValues={{
        salarySlipConsent: true,
        gender: "female",
        role: "teacher",
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
