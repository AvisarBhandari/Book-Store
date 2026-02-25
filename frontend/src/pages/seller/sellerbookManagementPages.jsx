import { useEffect, useState } from "react";
import { getSellerProfile } from "../../utils/auth";
import SellerBookTable from "../../components/seller/SellerBookTable.jsx";

const SellerBookManagementPages = () => {
  const [sellerId, setSellerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Fetching seller profile...");
      const profile = await getSellerProfile();
      console.log("Profile fetched:", profile);
      if (profile && profile.user) {
        setSellerId(profile.user._id);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-6">Loading seller info...</div>;
  if (!sellerId)
    return (
      <div className="p-6 text-red-600">Failed to load seller profile</div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Seller Book Management</h1>
      <SellerBookTable sellerId={sellerId} />
    </div>
  );
};

export default SellerBookManagementPages;
