import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Function to get the proper NEXTAUTH_URL based on environment
function getAuthUrl() {
  // For production environments, use the deployed URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // For Railway deployments, you might have a specific env var
  if (process.env.RAILWAY_PUBLIC_URL) {
    return process.env.RAILWAY_PUBLIC_URL;
  }
  
  // Default to localhost for development
  return "http://localhost:3000";
}

// Update authOptions with the proper URL
const updatedAuthOptions = {
  ...authOptions,
  trustHost: true, // Allow trusting the host header
};

const handler = NextAuth(updatedAuthOptions);

export { handler as GET, handler as POST };