export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    })
    .json({ message: "Logged out successfully" });
};
