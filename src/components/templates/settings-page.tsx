"use client";

import React, { useState } from "react";
import { Save, RotateCcw, Shield, Sliders, Bell, Globe } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: "text" | "number" | "select" | "toggle" | "textarea";
  defaultValue?: any;
  options?: { label: string; value: any }[]; // For select type
}

interface SettingGroup {
  id: string;
  title: string;
  description?: string;
  icon?: any;
  items: SettingItem[];
}

interface SettingsPageTemplateProps {
  title: string;
  description?: string;
  groups: SettingGroup[];
  onSave?: (values: Record<string, any>) => void;
}

export function SettingsPageTemplate({
  title,
  description,
  groups,
  onSave,
}: SettingsPageTemplateProps) {
  // Initialize state with default values
  const initialValues: Record<string, any> = {};
  groups.forEach((group) => {
    group.items.forEach((item) => {
      initialValues[item.id] = item.defaultValue;
    });
  });

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: string) => {
    setValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (id: string, val: any) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    setValues(initialValues);
    toast.info("Settings reset to default values!");
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (onSave) {
        onSave(values);
      } else {
        toast.success("Settings saved successfully!");
      }
    }, 1000);
  };

  return (
    <PageContainer>
      {/* Page Header with Save Actions */}
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isSaving}
              className="h-8 text-xs font-semibold flex items-center gap-1 border-border/80"
            >
              <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Reset</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 text-xs font-semibold flex items-center gap-1"
            >
              <Save className="h-3.5 w-3.5 text-white" />
              <span>Save Changes</span>
            </Button>
          </div>
        }
      />

      {/* Tabs configuration for settings groups */}
      <Tabs defaultValue={groups[0]?.id || ""} className="w-full">
        <div className="border-b border-border/60 pb-3 mb-6 overflow-x-auto -mx-6 px-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl h-10 border border-border/50">
            {groups.map((group) => {
              const Icon = group.icon || Sliders;
              return (
                <TabsTrigger
                  key={group.id}
                  value={group.id}
                  className="rounded-lg text-xs px-4 h-8 font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  {group.title}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {groups.map((group) => (
          <TabsContent key={group.id} value={group.id} className="space-y-6 outline-none">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-foreground">{group.title} Settings</h3>
                {group.description && (
                  <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
                )}
              </div>

              <div className="divide-y divide-border/60">
                {group.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="max-w-xl text-left">
                      <label className="text-xs font-bold text-foreground block">{item.label}</label>
                      {item.description && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 justify-start sm:justify-end min-w-[200px]">
                      {item.type === "toggle" && (
                        <button
                          onClick={() => handleToggle(item.id)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            values[item.id] ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              values[item.id] ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      )}

                      {item.type === "text" && (
                        <input
                          type="text"
                          value={values[item.id] || ""}
                          onChange={(e) => handleChange(item.id, e.target.value)}
                          className="w-full sm:w-64 h-8 rounded-lg border border-border bg-background px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                      )}

                      {item.type === "number" && (
                        <input
                          type="number"
                          value={values[item.id] || 0}
                          onChange={(e) => handleChange(item.id, parseInt(e.target.value))}
                          className="w-full sm:w-64 h-8 rounded-lg border border-border bg-background px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                      )}

                      {item.type === "textarea" && (
                        <textarea
                          value={values[item.id] || ""}
                          onChange={(e) => handleChange(item.id, e.target.value)}
                          rows={3}
                          className="w-full sm:w-64 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                      )}

                      {item.type === "select" && (
                        <select
                          value={values[item.id] || ""}
                          onChange={(e) => handleChange(item.id, e.target.value)}
                          className="w-full sm:w-64 h-8 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                        >
                          {item.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </PageContainer>
  );
}
export type { SettingItem, SettingGroup };
