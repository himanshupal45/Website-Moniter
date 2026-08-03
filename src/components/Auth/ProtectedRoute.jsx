import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function useAuth() {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  return {
    isAuthenticated: !!token,
    user,
    token,
  };
}

export function logout(navigate) {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("user");
  
  if (navigate) {
    navigate("/login");
  }
}