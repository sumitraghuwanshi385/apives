const ADMIN_EMAIL = "beatslevelone@gmail.com";

module.exports = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (
      req.user.email?.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    next();
  } catch (err) {
    console.error("❌ Blog admin middleware error:", err);

    return res.status(500).json({
      message: "Authorization failed",
    });
  }
};