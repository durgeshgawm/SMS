"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { FormWizardTemplate } from "@/components/templates/form-wizard";
import { FormInput } from "@/components/forms";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

export default function CreateBranchPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const router = useRouter();

  if (role !== "super-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const wizardSteps = [
    {
      title: "Branch Profile",
      description: "Details concerning campus name and unique institutional codes.",
      fields: (
        <>
          <FormInput name="name" label="Branch Name" required placeholder="e.g. Mumbai Campus" />
          <FormInput name="code" label="Campus Code Designation" required placeholder="e.g. GW-MUM-02" />
        </>
      ),
    },
    {
      title: "Locations & Billing",
      description: "Metro area details and projected yearly operation budgets.",
      fields: (
        <>
          <FormInput name="city" label="City" required placeholder="e.g. Mumbai" />
          <FormInput name="revenue" label="Projected Yearly Revenue (₹)" type="number" required placeholder="e.g. 1500000" />
        </>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    toast.success("Campus branch details submitted and compiled successfully!");
    router.push(`/${role}/branch-management`);
  };

  const handleCancel = () => {
    router.push(`/${role}/branch-management`);
  };

  return (
    <FormWizardTemplate
      title="Create Campus Branch"
      description="Interactive setup wizard to initialize and enroll a new school branch campus."
      steps={wizardSteps}
      defaultValues={{
        name: "",
        code: "",
        city: "",
        revenue: 800000,
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
