const jwt = require("jsonwebtoken");
const User = require("../model/customer-model");   // ✔️ Import User model

/**
 *  protect
 * ----------
 * 1. Verifies JWT from  `Authorization: Bearer <token>` header.
 * 2. Loads full user (minus password) into `req.user`.
 */
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; //  now contains _id, name, role, email, …
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

/**
 * allowRoles("employee", "hr")
 * ----------------------------
 * Permits only the specified roles.
 */
const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: Role not allowed" });
        }
        next();
    };
};

/**
 * requireRole(["hr", "manager"])
 * ------------------------------
 * Same idea but array syntax.
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient role." });
        }
        next();
    };
};

module.exports = {
    protect,
    allowRoles,
    requireRole,
};
