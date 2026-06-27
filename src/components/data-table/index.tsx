"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  MoreHorizontal,
  Printer,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import * as XLSX from "xlsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  exportFileName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  exportFileName = "table-export",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Client-Side Excel Exporting
  const handleExportExcel = () => {
    try {
      const exportData = table.getFilteredRowModel().rows.map((row) => {
        const item: any = {};
        row.getVisibleCells().forEach((cell) => {
          const id = cell.column.id;
          // Avoid exporting action columns or checkbox select columns
          if (id !== "actions" && id !== "select") {
            item[id] = cell.getValue();
          }
        });
        return item;
      });

      if (exportData.length === 0) {
        toast.error("No data to export");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data List");
      XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
      toast.success("Excel exported successfully!");
    } catch (e) {
      toast.error("Failed to export Excel sheet");
    }
  };

  // Client-Side Print Layout
  const handlePrint = () => {
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const visibleColumns = table
        .getAllColumns()
        .filter((col) => col.getIsVisible() && col.id !== "actions" && col.id !== "select");

      const headers = visibleColumns.map((col) => col.id.toUpperCase());
      const rows = table.getFilteredRowModel().rows.map((row) =>
        visibleColumns.map((col) => {
          const value = row.getValue(col.id);
          return value !== null && value !== undefined ? String(value) : "";
        })
      );

      const html = `
        <html>
          <head>
            <title>SMS Print Export</title>
            <style>
              body { font-family: sans-serif; padding: 24px; color: #333; }
              h2 { text-align: center; margin-bottom: 20px; color: #1a1f36; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
              th { background-color: #f7fafc; font-weight: bold; color: #4a5568; }
              tr:nth-child(even) { background-color: #fcfcfc; }
            </style>
          </head>
          <body>
            <h2>SMS Exported Data Ledger</h2>
            <table>
              <thead>
                <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${rows
                  .map((row) => `<tr>${row.map((val) => `<td>${val}</td>`).join("")}</tr>`)
                  .join("")}
              </tbody>
            </table>
            <script>window.print();</script>
          </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      toast.success("Sent list to printer");
    } catch (e) {
      toast.error("Failed to open print layout");
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {searchKey ? (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-9 h-9 border-border bg-card text-xs focus-visible:ring-primary"
            />
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {/* Export tools */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 h-9 text-xs border-border bg-card"
          >
            <Download className="h-3.5 w-3.5" />
            Export Excel
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 h-9 text-xs border-border bg-card"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>

          {/* Visibility options dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-card text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-9 gap-1.5 px-2.5 hover:bg-muted/40 ml-auto"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Columns
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-xs"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-xs font-semibold text-foreground py-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/20 border-b border-border/60"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-xs py-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-xs text-muted-foreground">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Table Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-[11px] text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-[11px] font-medium text-muted-foreground">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-16 rounded-md border border-border bg-card text-[11px] focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[80px] items-center justify-center text-[11px] font-medium text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-border bg-card"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-border bg-card"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-border bg-card"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-border bg-card"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
