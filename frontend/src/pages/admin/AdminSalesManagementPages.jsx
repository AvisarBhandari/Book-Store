import React, { useEffect, useState } from "react";
import {
  getAdminSalesOverview,
  getAdminDashboard,
} from "../../api/AdminDashboard.api.js";
import StatCard from "../../components/admin/dashboard/StatCard.jsx";
import StatCardSkeleton from "../../components/admin/skeletons/StatCardSkeleton.jsx";
import SalesLineChart from "../../components/admin/dashboard/SalesLineChart.jsx";
import TopBooksBarChart from "../../components/admin/dashboard/TopBooksBarChart.jsx";
import OrdersTable from "../../components/admin/dashboard/OrdersTable.jsx";

const AdminSalesManagementPages = () => {
  const [cards, setCards] = useState(null);
  const [charts, setCharts] = useState({ downloadsOverTime: [], topBooks: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [salesRes, dashboardRes] = await Promise.all([
          getAdminSalesOverview(),
          getAdminDashboard(),
        ]);

        setCards(salesRes.cards || null);
        setCharts({
          downloadsOverTime: dashboardRes.downloadsOverTime || [],
          topBooks: dashboardRes.topBooks || [],
        });
        setError(null);
      } catch (err) {
        console.error("Failed to load sales data:", err);
        setError("Failed to load sales data. Please try again.");
      }
    };

    loadData();
  }, []);

  if (!cards && !error) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Sales Overview</h2>
          <p className="text-sm text-base-content/70">
            Key sales metrics across your store.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Sales Overview</h2>
          <p className="text-sm text-base-content/70">
            Key sales metrics across your store.
          </p>
        </div>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const {
    totalSales = 0,
    totalOrders = 0,
    newCustomersToday = 0,
    avgOrderValue = 0,
  } = cards || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sales Overview</h2>
        <p className="text-sm text-base-content/70">
          Track total sales, orders, new customers and average order value.
        </p>
      </div>

      {/* Stat Cards (match style of AdminIndexPages) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sales (Rs)" value={totalSales} />
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="New Customers (Today)" value={newCustomersToday} />
        <StatCard title="Avg Order Value (Rs)" value={avgOrderValue} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesLineChart
          data={charts.downloadsOverTime}
          title="Sales Over Time"
        />
        <TopBooksBarChart data={charts.topBooks} />
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
};

export default AdminSalesManagementPages;
