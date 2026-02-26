import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopBooksBarChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const formatted = data.map((b) => ({
    title: b.title,
    downloads: b.count ?? b.downloads ?? 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-base-100 p-4 rounded-xl shadow"
    >
      <h3 className="font-semibold mb-4">Top Selling Books</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip
            formatter={(value) => new Intl.NumberFormat().format(value)}
          />
          <Bar dataKey="downloads" fill="#93c5fd" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TopBooksBarChart;

