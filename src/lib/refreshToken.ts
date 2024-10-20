import Cookies from "js-cookie";
import axios from "axios";

export default async function refreshToken() {
    try {
      // Get the appropriate refresh token
      const refreshToken =
        Cookies.get("adminRefreshToken") ||
        Cookies.get("agentRefreshToken") ||
        Cookies.get("refreshToken");
  
      // Determine the correct refresh endpoint based on the refresh token type
      const endpoint = Cookies.get("adminRefreshToken")
        ? "http://localhost:5000/admin/refresh-token"
        : Cookies.get("agentRefreshToken")
        ? "http://localhost:5000/agent/refresh-token"
        : "http://localhost:5000/refresh-token";
  
      // Make the request to refresh the token
      const res = await axios.post(endpoint, { refreshToken });
  
      const { accessToken } = res.data;
      if (Cookies.get("adminRefreshToken")) {
        Cookies.set("adminToken", accessToken); // Update token in cookies
        return accessToken;
      } else if (Cookies.get("agentRefreshToken")) {
        Cookies.set("agentToken", accessToken); // Update token in cookies
        return accessToken;
      } else {
        Cookies.set("accessToken", accessToken); // Update token in cookies
        return accessToken;
      }
    } catch (error) {
      console.error("Refresh token failed:", error);
  
      // Redirect based on the user's role
      if (Cookies.get("adminRefreshToken")) {
        redirectTo("/admin");
      } else if (Cookies.get("agentRefreshToken")) {
        redirectTo("/agent");
      } else {
        redirectTo("/login");
      }
  
      throw new Error("Refresh token expired. Please log in again.");
    }
  }

  function redirectTo(path: string) {
    clearTokens(); // Clear tokens before redirecting
    window.location.href = path;
  }

  function clearTokens() {
    const tokens = [
      "accessToken",
      "refreshToken",
      "adminToken",
      "agentToken",
      "adminRefreshToken",
      "agentRefreshToken",
    ];
    tokens.forEach((token) => Cookies.remove(token));
  }