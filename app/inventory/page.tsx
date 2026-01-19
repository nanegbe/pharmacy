"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

interface Drug {
  id: string;
  name: string;
  category: string | null;
  price: number;
  quantity: number;
  expiryDate: string | null;
  description: string | null;
}

export default function InventoryPage() {
  const router = useRouter();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    try {
      const response = await fetch("/api/drugs");
      if (response.ok) {
        const data = await response.json();
        setDrugs(data);
      }
    } catch (error) {
      console.error("Error fetching drugs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrugs = drugs.filter((drug) => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || drug.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(drugs.map((d) => d.category).filter(Boolean)));

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this drug?")) return;

    try {
      const response = await fetch(`/api/drugs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDrugs();
      }
    } catch (error) {
      console.error("Error deleting drug:", error);
    }
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiry = new Date(expiryDate);
    return expiry >= today && expiry <= thirtyDaysFromNow;
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Drug Inventory
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Add New Drug
          </button>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by drug name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat || ""}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
            </div>
          ) : filteredDrugs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">No drugs found in inventory</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-zinc-900">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                      Drug Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200 dark:bg-zinc-900 dark:divide-zinc-800">
                  {filteredDrugs.map((drug) => (
                    <tr key={drug.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-900 dark:text-white">
                          {drug.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          {drug.category || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-900 dark:text-white">
                          GHS{drug.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-900 dark:text-white">
                            {drug.quantity}
                          </span>
                          {drug.quantity === 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Out of Stock
                            </span>
                          )}
                          {drug.quantity > 0 && drug.quantity <= 10 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {drug.expiryDate
                              ? new Date(drug.expiryDate).toLocaleDateString()
                              : "-"}
                          </span>
                          {isExpired(drug.expiryDate) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Expired
                            </span>
                          )}
                          {!isExpired(drug.expiryDate) && isExpiringSoon(drug.expiryDate) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                              Expiring Soon
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingDrug(drug)}
                          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(drug.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      {(showAddModal || editingDrug) && (
        <DrugModal
          drug={editingDrug}
          onClose={() => {
            setShowAddModal(false);
            setEditingDrug(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingDrug(null);
            fetchDrugs();
          }}
        />
      )}
    </DashboardLayout>
  );
}

function DrugModal({
  drug,
  onClose,
  onSuccess,
}: {
  drug: Drug | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: drug?.name || "",
    category: drug?.category || "",
    price: drug?.price?.toString() || "",
    quantity: drug?.quantity?.toString() || "",
    expiryDate: drug?.expiryDate?.split("T")[0] || "",
    description: drug?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation for numeric fields
    const priceNumber = parseFloat(formData.price);
    const quantityNumber = parseInt(formData.quantity, 10);

    if (isNaN(priceNumber) || priceNumber < 0) {
      setLoading(false);
      setError("Please enter a valid price.");
      return;
    }

    if (isNaN(quantityNumber) || quantityNumber < 0) {
      setLoading(false);
      setError("Please enter a valid quantity.");
      return;
    }

    try {
      const url = drug ? `/api/drugs/${drug.id}` : "/api/drugs";
      const method = drug ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category || null,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          expiryDate: formData.expiryDate || null,
          description: formData.description || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        setError("Failed to save drug. Please try again.");
      }
    } catch (error) {
      console.error("Error saving drug:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          {drug ? "Edit Drug" : "Add New Drug"}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Drug Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Quantity *
            </label>
            <input
              type="number"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              {loading ? "Saving..." : drug ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}