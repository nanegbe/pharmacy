"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import UserManagementDropdown from "@/components/UserManagementDropdown";
import DashboardLayout from "@/components/DashboardLayout";

interface QuickStats {
  totalDrugs: number;
  salesToday: number;
  revenueToday: number;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      const response = await fetch("/api/quick-stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching quick stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/inventory">
            <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-zinc-900 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                      Inventory
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Manage pharmacy inventory
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/sales">
            <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-zinc-900 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                      Sales
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Process sales transactions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/analytics">
            <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-zinc-900 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                      Reports
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      View analytics and reports
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div> */}

        <div className="bg-white shadow rounded-lg p-6 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Quick Stats
          </h2>
          {loadingStats ? (
            <div className="text-center py-8">
              <p className="text-zinc-600 dark:text-zinc-400">Loading stats...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {stats?.totalDrugs || 0}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Products</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {stats?.salesToday || 0}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Sales Today</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                  GHS{stats?.revenueToday?.toFixed(2) || "0.00"}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Revenue Today</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/inventory">
            <div className="relative overflow-hidden shadow-lg rounded-lg h-96 hover:shadow-xl transition-all cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-blue-700/90"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Inventory
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Manage pharmacy inventory
                  </p>
                </div>
                <div className="flex items-center text-white text-sm font-medium">
                  <span>View Details</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/sales">
            <div className="relative overflow-hidden shadow-lg rounded-lg h-96 hover:shadow-xl transition-all cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-green-700/90"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Sales
                  </h3>
                  <p className="text-green-100 text-sm">
                    Process sales transactions
                  </p>
                </div>
                <div className="flex items-center text-white text-sm font-medium">
                  <span>View Details</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/analytics">
            <div className="relative overflow-hidden shadow-lg rounded-lg h-96 hover:shadow-xl transition-all cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/90 to-red-700/90"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Reports
                  </h3>
                  <p className="text-red-100 text-sm">
                    View analytics and reports
                  </p>
                </div>
                <div className="flex items-center text-white text-sm font-medium">
                  <span>View Details</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}