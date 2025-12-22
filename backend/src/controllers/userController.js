import user from "../models/user.js";

export async function getAlluser(req, res) {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const createuser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existinguser = await user.findOne({ email });
    if (existinguser) {
      return res.status(409).json({ message: "user already exists" });
    }

    const ppImage = req.file ? req.file.path : null;

    const newuser = await user.create({
      name,
      email,
      password,
      ppImage,
    });

    res.status(201).json({
      message: "user created successfully",
      user: {
        id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        ppImage: newuser.ppImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// export const loginuser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const user = await user.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = user.generateToken();

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         storeName: user.storeName,
//         businessType: user.businessType,
//         ppImage: user.ppImage,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
