import { useEffect, useState } from "react";
import { getSellerDashboard } from "../../api/sellerDashboard.api";

import StatCard from "../../components/seller/dashboard/StatCard";
import SalesLineChart from "../../components/seller/dashboard/SalesLineChart";
import TopBooksDonut from "../../components/seller/dashboard/TopBooksDonut";
import TopBooksTable from "../../components/seller/dashboard/TopBooksTable";

import StatCardSkeleton from "../../components/seller/skeletons/StatCardSkeleton";
import ChartSkeleton from "../../components/seller/skeletons/ChartSkeleton";
import TableSkeleton from "../../components/seller/skeletons/TableSkeleton";

const SellerIndexPages = () => {
  const [data, setData] = useState(null);
  

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getSellerDashboard();
        console.log("Dashboard API response:", res);
        setData(res);
      } catch (err) {
        console.error("Dashboard load failed:", err);
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
        <StatCard title="Total Sales" value={cards?.totalSales ?? 0} />
        <StatCard title="Today Sales" value={cards?.todaySales ?? 0} />
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

export default SellerIndexPages;
