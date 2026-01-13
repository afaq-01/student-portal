import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

// This middleware will verify the JWT from frontend
// and attach `req.auth.userId` for later use.
export default ClerkExpressRequireAuth();
