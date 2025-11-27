"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TopDrug {
  name: string;
  quantity: number;
  revenue: number;
}

interface Analytics {
  totalRevenue: number;
  totalDrugsSold: number;
  salesCount: number;
  topSellingDrugs: TopDrug[];
  period: string;
  fromDate: string;
  toDate: string;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("24h");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let url = `/api/analytics?period=${period}`;
      
      if (period === "custom" && customStartDate && customEndDate) {
        url += `&startDate=${customStartDate}&endDate=${customEndDate}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    if (newPeriod === "custom") {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
    }
  };

  const applyCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      fetchAnalytics();
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "24h":
        return "Last 24 Hours";
      case "7d":
        return "Last 7 Days";
      case "30d":
        return "Last 30 Days";
      case "12m":
        return "Last 12 Months";
      case "custom":
        return "Custom Range";
      default:
        return "Last 24 Hours";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                ← Back
              </Link>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                Sales Analytics
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Period Selector */}
          <div className="mb-6 bg-white shadow rounded-lg p-6 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Time Period
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => handlePeriodChange("24h")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === "24h"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                Last 24 Hours
              </button>
              <button
                onClick={() => handlePeriodChange("7d")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === "7d"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => handlePeriodChange("30d")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === "30d"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => handlePeriodChange("12m")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === "12m"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                Last 12 Months
              </button>
              <button
                onClick={() => handlePeriodChange("custom")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === "custom"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                Custom Range
              </button>
            </div>

            {/* Custom Date Range Picker */}
            {showCustomDatePicker && (
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <button
                  onClick={applyCustomDateRange}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">Loading analytics...</p>
            </div>
          ) : analytics ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="relative overflow-hidden shadow-lg rounded-lg p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/90 to-purple-700/90"></div>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                  <div className="relative">
                    <p className="text-sm font-medium text-purple-100">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      GHS{analytics.totalRevenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-purple-200 mt-1">
                      {getPeriodLabel()}
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden shadow-lg rounded-lg p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-orange-700/90"></div>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                  <div className="relative">
                    <p className="text-sm font-medium text-orange-100">
                      Total Drugs Sold
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {analytics.totalDrugsSold}
                    </p>
                    <p className="text-xs text-orange-200 mt-1">
                      {getPeriodLabel()}
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden shadow-lg rounded-lg p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/90 to-teal-700/90"></div>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                  <div className="relative">
                    <p className="text-sm font-medium text-teal-100">
                      Total Sales
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {analytics.salesCount}
                    </p>
                    <p className="text-xs text-teal-200 mt-1">
                      {getPeriodLabel()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Selling Drugs */}
              <div className="bg-white shadow rounded-lg p-6 dark:bg-zinc-900">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                  Top Selling Drugs
                </h2>
                {analytics.topSellingDrugs.length === 0 ? (
                  <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
                    No sales data available for this period
                  </p>
                ) : (
                  <div className="space-y-4">
                    {analytics.topSellingDrugs.map((drug, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {drug.name}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {drug.quantity} units sold
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-zinc-900 dark:text-white">
                            GHS{drug.revenue.toFixed(2)}
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">
                Failed to load analytics data
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
