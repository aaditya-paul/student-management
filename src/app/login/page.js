"use client";
import AdminLogin from "@/screens/admin-login";
import StudentLogin from "@/screens/student-login";
import TeacherLogin from "@/screens/teacher-login";
import {useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";
import React from "react";

function Login() {
  const router = useRouter();
  const q = useSearchParams();
  const type = q.get("type");
  console.log(type);
  if (type === "student") {
    return <StudentLogin />;
  } else if (type === "teacher") {
    return <TeacherLogin />;
  } else if (type === "admin") {
    return <AdminLogin />;
  } else {
    router.push("/");
  }

  return null;
}

export default Login;
