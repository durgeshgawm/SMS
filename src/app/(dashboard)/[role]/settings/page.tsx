"use client";

import React, { use } from "react";
import { Sliders, Bell, Globe, Shield, Database } from "lucide-react";
import { SettingsPageTemplate, SettingGroup } from "@/components/templates/settings-page";
import { UserRole } from "@/types/common";

export default function SystemSettingsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "branch-admin" && role !== "academic") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const settingsGroups: SettingGroup[] = [
    {
      id: "school-profile",
      title: "School Profile",
      description: "Manage Greenwood International school details, affiliation codes, and contact descriptors.",
      icon: Sliders,
      items: [
        { id: "schoolName", label: "Academy Full Name", type: "text", defaultValue: "Greenwood International Academy" },
        { id: "affNo", label: "CBSE Affiliation Number", type: "text", defaultValue: "CBSE-AFF-2730554" },
        { id: "supportEmail", label: "Institutional Support Email", type: "text", defaultValue: "admin@greenwood.edu.in" },
        { id: "supportPhone", label: "Support Desk Contact No", type: "text", defaultValue: "+91 11 2758 9642" },
      ],
    },
    {
      id: "notifications",
      title: "Integrations & Gateways",
      description: "Configure Twilio SMS gateways, WhatsApp alert notifications, and Razorpay fee integrations.",
      icon: Bell,
      items: [
        { id: "whatsappAlerts", label: "WhatsApp Alert Gateway", description: "Send real-time attendance logs and fee receipts directly to parent WhatsApp accounts.", type: "toggle", defaultValue: true },
        { id: "twilioSms", label: "Twilio SMS Broadcast Gateway", description: "Automate SMS broadcast notifications when students log late entries.", type: "toggle", defaultValue: true },
        { id: "razorpayGateway", label: "Razorpay Fee Gateway Node", description: "Enable online fee processing with card, netbanking, and UPI channels.", type: "toggle", defaultValue: true },
      ],
    },
    {
      id: "localization",
      title: "Regional Localization",
      description: "Regional settings, default languages, timezones, and currency options.",
      icon: Globe,
      items: [
        { id: "timezone", label: "Primary Timezone", type: "select", defaultValue: "IST", options: [
          { label: "India Standard Time (IST - UTC+5:30)", value: "IST" },
          { label: "Coordinated Universal Time (UTC)", value: "UTC" },
          { label: "Eastern Standard Time (EST - UTC-5)", value: "EST" },
        ]},
        { id: "currency", label: "Billing Currency Symbol", type: "select", defaultValue: "INR", options: [
          { label: "Indian Rupee (₹ - INR)", value: "INR" },
          { label: "US Dollar ($ - USD)", value: "USD" },
        ]},
      ],
    },
  ];

  return (
    <SettingsPageTemplate
      title="General Settings Panel"
      description="Configure Greenwood school metadata variables, SMS gateways, payment modes, and regional localizations."
      groups={settingsGroups}
    />
  );
}
