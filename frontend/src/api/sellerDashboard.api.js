import axios from "axios";

export const getSellerDashboard = async () => {
  const res = await axios.get(
    "http://localhost:5001/api/seller/dashboard/overview",
    {
      withCredentials: true,
    },
  );
  return res.data;
};
