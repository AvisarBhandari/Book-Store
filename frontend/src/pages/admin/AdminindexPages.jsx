import React, { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/adminDashboard.api";

import StatCard from "../../components/admin/dashboard/StatCard";
import SalesLineChart from "../../components/admin/dashboard/SalesLineChart";
import TopBooksDonut from "../../components/admin/dashboard/TopBooksDonut";
import TopBooksTable from "../../components/admin/dashboard/TopBooksTable";

import StatCardSkeleton from "../../components/admin/skeletons/StatCardSkeleton";
import ChartSkeleton from "../../components/admin/skeletons/ChartSkeleton";
import TableSkeleton from "../../components/admin/skeletons/TableSkeleton";

const AdminIndexPages = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getAdminDashboard();
        setData(res);
      } catch (err) {
        console.error("Admin dashboard load failed:", err);
        setData({ error: true });
      }
    };

    loadDashboard();
  }, []);

  if (!data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="alert alert-error">
        Failed to load dashboard. Please refresh.
      </div>
    );
  }

  const { cards, downloadsOverTime, topBooks } = data;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Books" value={cards?.totalBooks ?? 0} />
        <StatCard title="Total Users" value={cards?.totalUsers ?? 0} />
        <StatCard title="Total Sales" value={cards?.totalSales ?? 0} />
        <StatCard title="Revenue" value={cards?.revenue ?? 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesLineChart data={downloadsOverTime ?? []} />
        <TopBooksDonut data={topBooks ?? []} />
      </div>

      {/* Table */}
      <TopBooksTable />
    </div>
  );
};

export default AdminIndexPages;
