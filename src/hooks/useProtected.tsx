import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import userAuth from "./useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeRequest } from "@/store/features/auth/authSlice";
import Loader from "@/components/loader/Loader";
import { set } from "react-hook-form";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
    const { user, isAuthenticated } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    // Đảm bảo rằng chúng ta chỉ redirect sau khi dữ liệu xác thực đã được tải.
    if (isAuthenticated === undefined) {
        return <Loader />;; // Hoặc có thể hiển thị một spinner để đợi
    }
    useEffect(() => {
        dispatch(fetchMeRequest());
    }, [])
    // Nếu người dùng chưa xác thực, chúng ta sẽ redirect người dùng đến trang đăng nhập
    if (!isAuthenticated) {

        return <Loader />;
    }


    return <>{children}</>;
}
