import { motion } from "framer-motion";

const StatCard = ({ title, value }) => {
  const formatNumber = (num) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="stat bg-base-100 rounded-xl shadow hover:scale-[1.02] transition"
    >
      <div className="stat-title">{title}</div>
      <div className="stat-value text-black text-base font-normal truncate">
        {formatNumber(value)}
      </div>
    </motion.div>
  );
};

export default StatCard;
