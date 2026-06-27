"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/feedback";
import { toast } from "@/components/ui/toast";

interface ListViewTemplateProps<TData> {
  title: string;
  description?: string;
  addLabel?: string;
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchKey?: string;
  searchPlaceholder?: string;
  exportFileName?: string;
  formFields?: React.ReactNode;
  defaultFormValues?: any;
  onAddSubmit?: (values: any) => void;
  onDeleteConfirm?: (row: TData) => void;
}

export function ListViewTemplate<TData extends { id: string | number }>({
  title,
  description,
  addLabel,
  data,
  columns,
  searchKey,
  searchPlaceholder,
  exportFileName,
  formFields,
  defaultFormValues = {},
  onAddSubmit,
  onDeleteConfirm,
}: ListViewTemplateProps<TData>) {
  const [listData, setListData] = useState<TData[]>(data);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TData | null>(null);

  const methods = useForm({
    defaultValues: defaultFormValues,
  });

  const handleAddSubmit = (values: any) => {
    if (onAddSubmit) {
      onAddSubmit(values);
    } else {
      const newRecord = {
        id: `rec-${Math.random().toString(36).substr(2, 9)}`,
        ...values,
      } as unknown as TData;
      setListData([newRecord, ...listData]);
      toast.success("Record created successfully!");
    }
    setIsFormOpen(false);
    methods.reset();
  };

  const handleDelete = (row: TData) => {
    setSelectedRow(row);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRow) {
      if (onDeleteConfirm) {
        onDeleteConfirm(selectedRow);
      } else {
        setListData(listData.filter((r) => r.id !== selectedRow.id));
        toast.success("Record deleted successfully!");
      }
    }
    setIsDeleteOpen(false);
    setSelectedRow(null);
  };

  return (
    <PageContainer>
      <PageHeader
        title={title}
        description={description}
        actions={
          addLabel && (
            <Button size="sm" onClick={() => setIsFormOpen(true)} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              {addLabel}
            </Button>
          )
        }
      />

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={listData}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
          exportFileName={exportFileName}
        />
      </div>

      {/* Standard Form Dialog */}
      {formFields && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md rounded-xl">
            <DialogHeader className="text-left">
              <DialogTitle className="text-sm font-bold text-foreground">{addLabel}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Fill in the details to create a new entry.
              </DialogDescription>
            </DialogHeader>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleAddSubmit)} className="space-y-4 pt-2">
                <div className="space-y-3">{formFields}</div>
                <DialogFooter className="pt-4 flex flex-row items-center gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsFormOpen(false);
                      methods.reset();
                    }}
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="h-8 text-xs font-semibold">
                    Submit
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      )}

      {/* Standard Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Record Deletion"
        description="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </PageContainer>
  );
}
export type { ListViewTemplateProps };
