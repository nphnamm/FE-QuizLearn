'client'
import { fetchMeRequest } from "@/store/features/auth/authSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function userAuth() {
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector((state: any) => state.auth);
    console.log(user, isAuthenticated ,'in userAuth');


    // useEffect(() => {
    //     if (user) {
    //         true;
    //     } else {
    //         false;
    //     }
    // }, [user]);
    // useEffect(() => {
    //     dispatch(fetchMeRequest());

    // }
    //     , []);
    
    if (user) {
        return true;
    } else {
        return false;
    }
}

export default userAuth;
