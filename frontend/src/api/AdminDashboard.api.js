import axios from "axios";

export const getAdminDashboard = async () => {
  const res = await axios.get(
    "http://localhost:5001/api/admin/dashboard/overview",
    { withCredentials: true },
  );
  return res.data;
};

export const getAdminSalesOverview = async () => {
  const res = await axios.get(
    "http://localhost:5001/api/admin/dashboard/sales-overview",
    { withCredentials: true },
  );
  return res.data;
};

export const getUserAndSellerSignups = async () => {
  const [usersRes, sellersRes] = await Promise.all([
    axios.get("http://localhost:5001/api/admin/dashboard/user-signups", {
      withCredentials: true,
    }),
    axios.get("http://localhost:5001/api/admin/dashboard/seller-signups", {
      withCredentials: true,
    }),
  ]);

  return {
    userSignups: usersRes.data?.userSignups ?? [],
    sellerSignups: sellersRes.data?.sellerSignups ?? [],
  };
};

export const getAdminUsersTable = async ({ page = 1, search = "" } = {}) => {
  const res = await axios.get(
    "http://localhost:5001/api/admin/dashboard/users",
    {
      params: { page, limit: 10, search },
      withCredentials: true,
    },
  );
  return res.data;
};

export const getAdminSellersTable = async ({ page = 1, search = "" } = {}) => {
  const res = await axios.get(
    "http://localhost:5001/api/admin/dashboard/sellers",
    {
      params: { page, limit: 10, search },
      withCredentials: true,
    },
  );
  return res.data;
};

export const adminDeleteUser = async (id) => {
  await axios.delete(
    `http://localhost:5001/api/admin/dashboard/users/${id}`,
    { withCredentials: true },
  );
};

export const adminDeleteSeller = async (id) => {
  await axios.delete(
    `http://localhost:5001/api/admin/dashboard/sellers/${id}`,
    { withCredentials: true },
  );
};

export const adminCreateUser = async ({ name, email, password }) => {
  const res = await axios.post(
    "http://localhost:5001/api/admin/dashboard/users",
    { name, email, password },
    { withCredentials: true },
  );
  return res.data;
};

export const adminUpdateUser = async (id, { name, email }) => {
  const res = await axios.put(
    `http://localhost:5001/api/admin/dashboard/users/${id}`,
    { name, email },
    { withCredentials: true },
  );
  return res.data;
};

export const adminCreateSeller = async ({
  name,
  email,
  password,
  storeName,
  businessType,
  phone,
}) => {
  const res = await axios.post(
    "http://localhost:5001/api/admin/dashboard/sellers",
    { name, email, password, storeName, businessType, phone },
    { withCredentials: true },
  );
  return res.data;
};

export const adminUpdateSeller = async (
  id,
  { name, email, storeName, businessType, phone },
) => {
  const res = await axios.put(
    `http://localhost:5001/api/admin/dashboard/sellers/${id}`,
    { name, email, storeName, businessType, phone },
    { withCredentials: true },
  );
  return res.data;
};

export const getAdminOrdersTable = async ({
  page = 1,
  limit = 10,
  search = "",
  sortField = "date",
  sortOrder = "desc",
} = {}) => {
  const res = await axios.get(
    "http://localhost:5001/api/admin/dashboard/orders",
    {
      params: { page, limit, search, sortField, sortOrder },
      withCredentials: true,
    },
  );
  return res.data;
};

export const adminDeleteOrders = async (ids) => {
  await axios.delete(
    "http://localhost:5001/api/admin/dashboard/orders",
    { data: { ids }, withCredentials: true },
  );
};

// ------------------------- Settings -------------------------
const API_BASE = "http://localhost:5001/api/admin";

export const getAdminProfile = async () => {
  const res = await axios.get(`${API_BASE}/profile`, { withCredentials: true });
  return res.data;
};

export const updateAdminProfile = async (formData) => {
  const res = await axios.put(`${API_BASE}/settings/profile`, formData, {
    withCredentials: true,
    headers: formData instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return res.data;
};

export const changeAdminPassword = async (currentPassword, newPassword) => {
  const res = await axios.put(
    `${API_BASE}/settings/password`,
    { currentPassword, newPassword },
    { withCredentials: true },
  );
  return res.data;
};

export const getAdminAdminsTable = async ({
  page = 1,
  search = "",
  sortOrder = "asc",
} = {}) => {
  const res = await axios.get(`${API_BASE}/dashboard/admins`, {
    params: { page, limit: 10, search, sortOrder },
    withCredentials: true,
  });
  return res.data;
};

export const adminCreateAdmin = async (formData) => {
  const res = await axios.post(`${API_BASE}/dashboard/admins`, formData, {
    withCredentials: true,
    headers: formData instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return res.data;
};

export const adminDeleteAdmin = async (id) => {
  await axios.delete(`${API_BASE}/dashboard/admins/${id}`, {
    withCredentials: true,
  });
};

export const exportAdminsCSV = async (search = "", sortOrder = "asc") => {
  const res = await axios.get(`${API_BASE}/dashboard/admins/export`, {
    params: { search, sortOrder },
    withCredentials: true,
    responseType: "blob",
  });
  return res.data;
};
