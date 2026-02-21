import { motion } from "framer-motion";
import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserAnalyticsCharts = ({ userSignups = [], sellerSignups = [] }) => {
  const [userSelected, setUserSelected] = useState("All Time");
  const [sellerSelected, setSellerSelected] = useState("All Time");

  const filterByDate = (data, selected) => {
    if (!Array.isArray(data)) return [];

    const now = new Date();

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);

      switch (selected) {
        case "Today":
          return itemDate.toDateString() === now.toDateString();

        case "This Week": {
          const firstDay = new Date(now);
          firstDay.setDate(now.getDate() - now.getDay());
          firstDay.setHours(0, 0, 0, 0);
          return itemDate >= firstDay;
        }

        case "This Month":
          return (
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          );

        case "All Time":
        default:
          return true;
      }
    });

    // Sort oldest → newest
    return [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const filteredUsers = useMemo(
    () => filterByDate(userSignups, userSelected),
    [userSignups, userSelected],
  );

  const filteredSellers = useMemo(
    () => filterByDate(sellerSignups, sellerSelected),
    [sellerSignups, sellerSelected],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Users Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-base-100 p-4 rounded-xl shadow"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Users Joined Over Time</h3>
          <select
            className="select select-xs select-bordered"
            value={userSelected}
            onChange={(e) => setUserSelected(e.target.value)}
          >
            <option>All Time</option>
            <option>This Month</option>
            <option>This Week</option>
            <option>Today</option>
          </select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-base-100 p-4 rounded-xl h-[260px]">
            <p className="text-center text-sm opacity-60">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={filteredUsers} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} />
              <YAxis tickLine={false} />
              <Tooltip formatter={(v) => new Intl.NumberFormat().format(v)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#fb7185"
                fill="url(#colorNew)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Sellers Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="bg-base-100 p-4 rounded-xl shadow"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Sellers Joined Over Time</h3>
          <select
            className="select select-xs select-bordered"
            value={sellerSelected}
            onChange={(e) => setSellerSelected(e.target.value)}
          >
            <option>All Time</option>
            <option>This Month</option>
            <option>This Week</option>
            <option>Today</option>
          </select>
        </div>

        {filteredSellers.length === 0 ? (
          <div className="bg-base-100 p-4 rounded-xl  h-[260px]">
            <p className="text-center text-sm opacity-60">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={filteredSellers} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} />
              <YAxis tickLine={false} />
              <Tooltip formatter={(v) => new Intl.NumberFormat().format(v)} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#facc15"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
};

export default UserAnalyticsCharts;
