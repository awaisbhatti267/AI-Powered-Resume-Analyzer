import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const RouteProtector = () => {
  // Check if user is logged in
  const user = localStorage.getItem("user");

  return user ? <Outlet /> : <Navigate to="/Login" />;
};

export default RouteProtector;
