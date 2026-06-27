"use client";

import React, { use, useState } from "react";
import { BookOpen, Plus, Search, Filter, Trash2, Eye, ShieldAlert, BookOpenCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  location: string; // e.g. Shelf A-4
  copies: number;
  available: number;
}

export default function LibraryBooksCatalogPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  // Verify access permissions
  const allowedRoles = ["super-admin", "library", "student", "parent", "teacher", "academic"];
  if (!allowedRoles.includes(role)) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const isLibrarian = role === "library" || role === "super-admin";

  const [books, setBooks] = useState<Book[]>([
    {
      id: "bk-1",
      isbn: "978-81-7026-300-5",
      title: "Introduction to Classical Physics",
      author: "Dr. H. C. Verma",
      category: "Physics",
      location: "Shelf P-12",
      copies: 8,
      available: 5,
    },
    {
      id: "bk-2",
      isbn: "978-0-13-110362-7",
      title: "The C Programming Language (2nd Ed)",
      author: "Brian W. Kernighan",
      category: "Computer Science",
      location: "Shelf C-03",
      copies: 5,
      available: 2,
    },
    {
      id: "bk-3",
      isbn: "978-93-5134-174-1",
      title: "Higher Engineering Mathematics",
      author: "Dr. B. S. Grewal",
      category: "Mathematics",
      location: "Shelf M-08",
      copies: 12,
      available: 9,
    },
    {
      id: "bk-4",
      isbn: "978-81-7709-322-2",
      title: "History of Ancient India",
      author: "Dr. R. S. Sharma",
      category: "History",
      location: "Shelf H-02",
      copies: 6,
      available: 0,
    },
    {
      id: "bk-5",
      isbn: "978-0-07-061569-4",
      title: "Advanced English Grammar & Usage",
      author: "Martin Hewings",
      category: "English Literature",
      location: "Shelf L-05",
      copies: 10,
      available: 8,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New book states
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newIsbn, setNewIsbn] = useState("");
  const [newCat, setNewCat] = useState("Physics");
  const [newLoc, setNewLoc] = useState("");
  const [newCopies, setNewCopies] = useState("5");

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor || !newIsbn) return;

    const copiesNum = parseInt(newCopies) || 1;
    const newBk: Book = {
      id: `bk-${Date.now()}`,
      isbn: newIsbn,
      title: newTitle,
      author: newAuthor,
      category: newCat,
      location: newLoc || "Unassigned Shelf",
      copies: copiesNum,
      available: copiesNum,
    };

    setBooks([newBk, ...books]);
    setIsModalOpen(false);
    toast.success(`Book "${newTitle}" registered in library catalog.`);

    // Reset fields
    setNewTitle("");
    setNewAuthor("");
    setNewIsbn("");
    setNewLoc("");
    setNewCopies("5");
  };

  const handleDeleteBook = (id: string) => {
    if (confirm("Are you sure you want to delete this book catalog entry?")) {
      setBooks(books.filter((b) => b.id !== id));
      toast.success("Book removed from catalog registry.");
    }
  };

  const filteredBooks = books.filter((bk) => {
    const matchesSearch =
      bk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.isbn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCat === "all" || bk.category === selectedCat;

    return matchesSearch && matchesCat;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Library Books Catalog"
        description="Search, filter, and inspect the Greenwood general academic catalog registry and check book availability."
        actions={
          isLibrarian && (
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
              <Plus className="h-4 w-4" />
              <span>Add Book Entry</span>
            </Button>
          )
        }
      />

      {/* Catalog Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Unique Book Titles</span>
          <h3 className="text-2xl font-bold tracking-tight">{books.length} Titles</h3>
          <div className="text-[10px] text-muted-foreground">Categorized across departments</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Physical Copies</span>
          <h3 className="text-2xl font-bold text-blue-500 tracking-tight">
            {books.reduce((acc, curr) => acc + curr.copies, 0)} Copies
          </h3>
          <div className="text-[10px] text-muted-foreground">In active library inventory</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Checked Out / Loaned</span>
          <h3 className="text-2xl font-bold text-amber-500 tracking-tight">
            {books.reduce((acc, curr) => acc + (curr.copies - curr.available), 0)} Copies
          </h3>
          <div className="text-[10px] text-muted-foreground">Currently issued to readers</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Available in Shelves</span>
          <h3 className="text-2xl font-bold text-green-500 tracking-tight">
            {books.reduce((acc, curr) => acc + curr.available, 0)} Copies
          </h3>
          <div className="text-[10px] text-muted-foreground">Ready for quick lending check</div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, author, ISBN..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Physics">Physics</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="History">History</option>
            <option value="English Literature">English Literature</option>
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">ISBN</th>
              <th className="p-4 font-semibold">Book Title</th>
              <th className="p-4 font-semibold">Author</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Shelf Location</th>
              <th className="p-4 font-semibold text-center">Total Copies</th>
              <th className="p-4 font-semibold text-center">In Shelf</th>
              <th className="p-4 font-semibold text-center">Lending State</th>
              {isLibrarian && <th className="p-4 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={isLibrarian ? 9 : 8} className="p-8 text-center text-muted-foreground">
                  No matching books found in the library registry catalog.
                </td>
              </tr>
            ) : (
              filteredBooks.map((bk) => (
                <tr key={bk.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">{bk.isbn}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground">{bk.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-foreground font-semibold">{bk.author}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded">
                      {bk.category}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">{bk.location}</td>
                  <td className="p-4 text-center font-semibold text-foreground">{bk.copies}</td>
                  <td className="p-4 text-center font-bold text-foreground">{bk.available}</td>
                  <td className="p-4 text-center">
                    {bk.available === 0 ? (
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full font-bold uppercase text-[9px]">
                        Out of Stock
                      </span>
                    ) : bk.available <= 2 ? (
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full font-bold uppercase text-[9px]">
                        Low Quantity
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full font-bold uppercase text-[9px]">
                        Available
                      </span>
                    )}
                  </td>
                  {isLibrarian && (
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteBook(bk.id)}
                          title="Remove Book Catalog entry"
                          className="p-1 border rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Book Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <BookOpenCheck className="h-4 w-4 text-primary" />
                Add Book entry in Library
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Book Title Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Physics"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Book Author</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. H. C. Verma"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">ISBN Reference Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 978-81-7026-300-5"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Book Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="History">History</option>
                    <option value="English Literature">English Literature</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Shelf Code / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shelf P-12"
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Initial Copies Count</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCopies}
                    onChange={(e) => setNewCopies(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs h-8 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Book entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
