import { motion } from "framer-motion";
import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const SalesLineChart = ({ data = [], title = "Purchases Over Time" }) => {
  const [selected, setSelected] = useState("All Time");

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  const filteredData = useMemo(() => {
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
          return itemDate.getMonth() === now.getMonth();
        case "This Year":
          return itemDate.getFullYear() === now.getFullYear();

        case "All Time":
        default:
          return true;
      }
    });

    // Auto sort by date (oldest → newest)
    return [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data, selected]);

  if (!filteredData.length) {
    return (
      <div className="bg-base-100 p-4 rounded-xl shadow">
        <div className="grid grid-cols-2 items-center mb-4">
          <h3 className="font-semibold">{title}</h3>

          <select
            className="select select-xs select-bordered justify-self-end"
            value={selected}
            onChange={handleChange}
          >
            <option>All Time</option>
            <option>This Year</option>
            <option>This Month</option>
            <option>This Week</option>
            <option>Today</option>
          </select>
        </div>

        <p className="text-center text-sm opacity-60">
          No data available for selected range.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-base-100 p-4 rounded-xl shadow"
    >
      <div className="grid grid-cols-2 items-center mb-4">
        <h3 className="font-semibold">{title}</h3>

        <select
          className="select select-xs select-bordered justify-self-end"
          value={selected}
          onChange={handleChange}
        >
          <option>All Time</option>
          <option>This Year</option>
          <option>This Month</option>
          <option>This Week</option>
          <option>Today</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => new Intl.NumberFormat().format(value)}
          />
          <Bar dataKey="count" fill="#4f46e5" />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SalesLineChart;
