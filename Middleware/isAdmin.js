import { clerkClient } from "@clerk/clerk-sdk-node";

export default async function isAdmin(req, res, next) {
  // Allow preflight request
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const user = await clerkClient.users.getUser(req.auth.userId);

    if (user.publicMetadata.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
