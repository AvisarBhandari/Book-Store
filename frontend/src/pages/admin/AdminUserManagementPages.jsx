import React, { useEffect, useState } from "react";
import UserAnalyticsCharts from "../../components/admin/user/UserAnalyticsCharts.jsx";
import AdminUserTable from "../../components/admin/user/AdminUserTable.jsx";
import AdminSellerTable from "../../components/admin/user/AdminSellerTable.jsx";
import { getUserAndSellerSignups } from "../../api/AdminDashboard.api.js";

const AdminUserManagementPages = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSignups, setUserSignups] = useState([]);
  const [sellerSignups, setSellerSignups] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const { userSignups, sellerSignups } = await getUserAndSellerSignups();
        setUserSignups(userSignups);
        setSellerSignups(sellerSignups);
        setError(null);
      } catch (err) {
        console.error("Failed to load user/seller analytics:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-4 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div className="skeleton h-[260px] w-full" />
          <div className="skeleton h-[260px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-sm text-base-content/70">
            Monitor user and seller growth over time.
          </p>
        </div>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-sm text-base-content/70">
          Real-time analytics based on user and seller join dates.
        </p>
      </div>

      <UserAnalyticsCharts
        userSignups={userSignups}
        sellerSignups={sellerSignups}
      />

      <AdminUserTable />

      <AdminSellerTable />
    </div>
  );
};

export default AdminUserManagementPages;