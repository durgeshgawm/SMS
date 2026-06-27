"use client";

import React, { use, useState } from "react";
import { Shield, Key, Save, RefreshCw, CheckSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface RolePermission {
  roleName: string;
  crm: boolean;
  academic: boolean;
  attendance: boolean;
  finance: boolean;
  hr: boolean;
  settings: boolean;
}

export default function RolePermissionsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const [permissions, setPermissions] = useState<RolePermission[]>([
    { roleName: "Academic Head", crm: false, academic: true, attendance: true, finance: false, hr: true, settings: false },
    { roleName: "Finance Manager", crm: false, academic: false, attendance: true, finance: true, hr: false, settings: false },
    { roleName: "HR Manager", crm: false, academic: false, attendance: true, finance: true, hr: true, settings: false },
    { roleName: "Librarian", crm: false, academic: true, attendance: false, finance: false, hr: false, settings: false },
    { roleName: "Educator (Teacher)", crm: false, academic: true, attendance: true, finance: false, hr: false, settings: false },
  ]);

  const handleToggle = (roleIndex: number, key: keyof Omit<RolePermission, "roleName">) => {
    setPermissions(
      permissions.map((p, idx) =>
        idx === roleIndex ? { ...p, [key]: !p[key] } : p
      )
    );
  };

  const handleSavePermissions = () => {
    toast.success("Security permissions updated and flushed to branch directories!");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Role Access Permissions"
        description="Configure fine-grained checkbox gates to grant or restrict access across functional ERP modules."
        actions={
          <Button onClick={handleSavePermissions} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            <span>Save Permissions Schema</span>
          </Button>
        }
      />

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm text-left">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-primary" />
            <span>Module Access Control Matrices</span>
          </h3>
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Key className="h-3.5 w-3.5" /> Branch Level Gateways
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs text-left border-collapse border border-border">
            <thead>
              <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                <th className="p-4 font-semibold border-r min-w-[150px]">System Access Role</th>
                <th className="p-4 font-semibold text-center border-r">CRM Access</th>
                <th className="p-4 font-semibold text-center border-r">Academic logs</th>
                <th className="p-4 font-semibold text-center border-r">Attendance toggles</th>
                <th className="p-4 font-semibold text-center border-r">Finance Ledgers</th>
                <th className="p-4 font-semibold text-center border-r">HR Directory</th>
                <th className="p-4 font-semibold text-center">System Settings</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, roleIdx) => (
                <tr key={p.roleName} className="border-b hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold text-foreground border-r">{p.roleName}</td>
                  
                  {/* CRM */}
                  <td className="p-4 text-center border-r">
                    <input
                      type="checkbox"
                      checked={p.crm}
                      onChange={() => handleToggle(roleIdx, "crm")}
                      className="h-4 w-4 text-primary rounded border border-border focus:ring-primary cursor-pointer"
                    />
                  </td>

                  {/* Academics */}
                  <td className="p-4 text-center border-r">
                    <input
                      type="checkbox"
                      checked={p.academic}
                      onChange={() => handleToggle(roleIdx, "academic")}
                      className="h-4 w-4 text-primary rounded border border-border focus:ring-primary cursor-pointer"
                    />
                  </td>

                  {/* Attendance */}
                  <td className="p-4 text-center border-r">
                    <input
                      type="checkbox"
                      checked={p.attendance}
                      onChange={() => handleToggle(roleIdx, "attendance")}
                      className="h-4 w-4 text-primary rounded border border-border focus:ring-primary cursor-pointer"
                    />
                  </td>

                  {/* Finance */}
                  <td className="p-4 text-center border-r">
                    <input
                      type="checkbox"
                      checked={p.finance}
                      onChange={() => handleToggle(roleIdx, "finance")}
                      className="h-4 w-4 text-primary rounded border border-border focus:ring-primary cursor-pointer"
                    />
                  </td>

                  {/* HR */}
                  <td className="p-4 text-center border-r">
                    <input
                      type="checkbox"
                      checked={p.hr}
                      onChange={() => handleToggle(roleIdx, "hr")}
                      className="h-4 w-4 text-primary rounded border border-border focus:ring-primary cursor-pointer"
                    />
                  </td>

                  {/* Settings */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={p.settings}
                      onChange={() => handleToggle(roleIdx, "settings")}
                      className="h-4 w-4 text-primary rounded border border-border focus:ring-primary cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
