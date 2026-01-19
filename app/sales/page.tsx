"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

interface Drug {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SaleItem {
  drugId: string;
  drugName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Sale {
  id: string;
  total: number;
  createdAt: string;
  items: SaleItem[];
}

export default function SalesPage() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    drugId: string;
    quantity: number;
  }[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDrugs();
    fetchSales();
  }, []);

  const fetchDrugs = async () => {
    try {
      const response = await fetch("/api/drugs");
      if (response.ok) {
        const data = await response.json();
        setDrugs(data.filter((d: Drug) => d.quantity > 0)); // Only show drugs in stock
      }
    } catch (error) {
      console.error("Error fetching drugs:", error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/sales");
      if (response.ok) {
        const data = await response.json();
        setSales(data);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setSelectedItems([...selectedItems, { drugId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: "drugId" | "quantity", value: string | number) => {
    const updated = [...selectedItems];
    if (field === "drugId") {
      updated[index].drugId = value as string;
    } else {
      updated[index].quantity = parseInt(value as string) || 1;
    }
    setSelectedItems(updated);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const drug = drugs.find((d) => d.id === item.drugId);
      return total + (drug ? drug.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmitSale = async () => {
    setError("");
    
    // Validate items
    if (selectedItems.length === 0) {
      setError("Please add at least one item to the sale");
      return;
    }

    for (const item of selectedItems) {
      if (!item.drugId) {
        setError("Please select a drug for all items");
        return;
      }
      if (item.quantity <= 0) {
        setError("Quantity must be greater than 0");
        return;
      }
      const drug = drugs.find((d) => d.id === item.drugId);
      if (drug && item.quantity > drug.quantity) {
        setError(`Insufficient stock for ${drug.name}. Available: ${drug.quantity}`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedItems }),
      });

      if (response.ok) {
        setShowNewSaleModal(false);
        setSelectedItems([]);
        fetchSales();
        fetchDrugs(); // Refresh drugs to update stock
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create sale");
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      setError("An error occurred while creating the sale");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Sales Management
          </h1>
          <button
            onClick={() => {
              setShowNewSaleModal(true);
              setSelectedItems([{ drugId: "", quantity: 1 }]);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            New Sale
          </button>
        </div>          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">No sales recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white shadow rounded-lg p-6 dark:bg-zinc-900"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(sale.createdAt).toLocaleString()}
                      </p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                        GHS{sale.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">
                      Items
                    </h3>
                    <div className="space-y-2">
                      {sale.items.map((item) => (
                        <div
                          key={item.drugId}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-zinc-600 dark:text-zinc-400">
                            {item.drugName} × {item.quantity}
                          </span>
                          <span className="text-zinc-900 dark:text-white font-medium">
                            GHS{item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {showNewSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              New Sale
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {selectedItems.map((item, index) => {
                const selectedDrug = drugs.find((d) => d.id === item.drugId);
                return (
                  <div
                    key={index}
                    className="flex gap-3 items-start p-4 border border-zinc-200 dark:border-zinc-800 rounded-md"
                  >
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Drug
                      </label>
                      <select
                        value={item.drugId}
                        onChange={(e) => updateItem(index, "drugId", e.target.value)}
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      >
                        <option value="">Select a drug</option>
                        {drugs.map((drug) => (
                          <option key={drug.id} value={drug.id}>
                            {drug.name} - GHS{drug.price.toFixed(2)} (Stock: {drug.quantity})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-32">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedDrug?.quantity || 999}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>

                    <div className="w-32">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Subtotal
                      </label>
                      <div className="px-3 py-2 text-zinc-900 dark:text-white font-medium">
                        GHS{selectedDrug ? (selectedDrug.price * item.quantity).toFixed(2) : "0.00"}
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(index)}
                      className="mt-7 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              <button
                onClick={addItem}
                className="w-full px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
              >
                + Add Item
              </button>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-zinc-900 dark:text-white">Total:</span>
                  <span className="text-zinc-900 dark:text-white">
                    GHS{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  setShowNewSaleModal(false);
                  setSelectedItems([]);
                  setError("");
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSale}
                disabled={submitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {submitting ? "Processing..." : "Complete Sale"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
