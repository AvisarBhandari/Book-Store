import Seller from "../models/seller.js";

export async function getAllSeller(req, res) {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const createSeller = async (req, res) => {
  try {
    const { name, email, password, storeName, businessType } = req.body;

    if (!name || !email || !password || !businessType) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(409).json({ message: "Seller already exists" });
    }

    const ppImage = req.file ? req.file.path : null;

    const newSeller = await Seller.create({
      name,
      email,
      password,
      storeName,
      businessType,
      ppImage,
    });

    res.status(201).json({
      message: "Seller created successfully",
      seller: {
        id: newSeller._id,
        name: newSeller.name,
        email: newSeller.email,
        storeName: newSeller.storeName,
        businessType: newSeller.businessType,
        ppImage: newSeller.ppImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
