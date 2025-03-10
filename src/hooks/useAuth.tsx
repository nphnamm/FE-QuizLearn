"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function userAuth() {
  const { user } = useSelector((state: any) => state.auth);
  
  // Check if user exists and is not an empty string
  return !!user && user !== "";
}

export default userAuth;
