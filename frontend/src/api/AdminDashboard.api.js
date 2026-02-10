import axios from "axios";

export const getAdminDashboard = async () => {
  const res = await axios.get(
    "http://localhost:5001/api/admin/dashboard/overview",
    { withCredentials: true },
  );
  return res.data;
};
