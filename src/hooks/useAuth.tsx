"client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function userAuth() {
  const { user } = useSelector((state: any) => state.auth);

  if (user) {
    return true;
  } else {
    return false;
  }
}

export default userAuth;
