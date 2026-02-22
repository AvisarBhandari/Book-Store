import { motion } from "framer-motion";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#4f46e5", "#e11d48", "#f59e0b", "#10b981", "#3b82f6"];

const TopBooksDonut = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-base-100 p-4 rounded-xl shadow"
    >
      <h3 className="font-semibold mb-4">Top Books</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="title"
            innerRadius={60}
            outerRadius={100}
            label={({ name, percent }) =>
              `${name ?? ""}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => new Intl.NumberFormat().format(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TopBooksDonut;
