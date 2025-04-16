"use client";
import {signInWithEmailAndPassword} from "@firebase/auth";
import React from "react";
import {auth, db} from "../../firebaseConfig";
import {doc, setDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";
// import Image from "../..";
function AdminLogin() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // sign in
      signInWithEmailAndPassword(auth, email, password).then((user) => {
        // create admin type user in db
        setDoc(
          doc(db, "users", user.user.uid),
          {
            email: email,
            uid: user.user.uid,
            admin: true,
            type: "admin",
          },
          {merge: true}
        );
      });

      // redirect to redirect page
      router.replace("/redirect");
    } catch (err) {
      setLoading(false);
      setError("Login failed. Please try again.");
      console.log(err);
    }
  };
  return (
    <div className=" text-white flex flex-col items-center justify-center h-screen bg-black/96.5">
      <div className=" text-3xl">
        Admin Login
        <span className="text-amber-300 text-3xl font-black">.</span>
      </div>
      <div className=" w-[80%] md:w-[50%] lg:w-[25%]">
        <form onSubmit={handleLogin} className=" flex flex-col gap-4 mt-8 ">
          <label className="text-lg font-medium">Email.</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" outline-none p-3 md:p-4 border-2 border-gray-300 rounded-lg"
            placeholder="abc@xyz.com"
          />
          <label className="text-lg font-medium">Password.</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" p-3 md:p-4 outline-none border-2 border-gray-300 rounded-lg"
            placeholder="@@@@@@@@"
          />

          <button className=" hover:bg-amber-300  transition-all ease-linear bg-white text-black border-black cursor-pointer border-2  p-3 md:p-4 rounded-lg  font-semibold text-lg">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
