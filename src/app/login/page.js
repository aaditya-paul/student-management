"use client";
import AdminLogin from "@/screens/admin-login";
import TeacherLogin from "@/screens/teacher-login";
import {useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";
import React from "react";
import ProtectedRoute from "../../../utils/checkAuth";
import {StudentLogin} from "@/screens/student-login";

function Login() {
  const router = useRouter();
  const q = useSearchParams();
  const type = q.get("type");
  const token = q.get("token");
  // console.log(type);
  if (type === "student") {
    return (
      <>
        <ProtectedRoute />
        <StudentLogin token={token} />
        {/* <StudentLogin token={token} /> */}
      </>
    );
  } else if (type === "teacher") {
    return (
      <>
        <ProtectedRoute />
        <TeacherLogin token={token} />
      </>
    );
  } else if (type === "admin") {
    return (
      <>
        <ProtectedRoute />
        <AdminLogin />
      </>
    );
  } else {
    router.push("/");
  }

  return null;
}

export default Login;
