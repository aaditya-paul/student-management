"use client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import React, {useEffect, useState} from "react";
import {auth, db} from "../../firebaseConfig";
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {useRouter} from "next/navigation";
import {TransparentLoadingComponent} from "@/components/loadingScreen";

function TeacherLogin({token}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validToken, setValidToken] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      if (token && token !== "undefined") {
        const tokenRef = doc(db, "invitations", token);
        const tokenSnap = await getDoc(tokenRef);
        if (tokenSnap.exists()) {
          const tokenData = tokenSnap.data();
          if (tokenData.type === "teacher") {
            setValidToken(true);
          } else {
            setError("This link is not valid for teacher access.");
          }
        } else {
          setError("Invalid or expired token.");
        }
      }
    };

    validateToken();
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Try to create user or sign in
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          try {
            userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
          } catch (signInError) {
            setError("Incorrect password. Please try again.");
            setLoading(false);
            return;
          }
        } else {
          setError(error.message || "Something went wrong during sign up.");
          setLoading(false);
          return;
        }
      }

      const user = userCredential.user;

      if (validToken) {
        // If token is valid, redirect to details page
        router.push(`/teacher/details?token=${token}&uid=${user.uid}`);
        // router.push("/redirect");
        setLoading(false);
        return;
      }

      // No token: check if teacher exists in teacher-invitations
      const docRef = doc(db, "teacher-invitations", email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError("You are not invited. Please contact the admin.");
        setLoading(false);
        return;
      }

      const data = docSnap.data();

      // Save to users collection
      await setDoc(
        doc(db, "users", user.uid),
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email,
          phone: data.phone,
          branch: data.branch,
          image: data?.image || null,
          uid: user.uid,
          type: "teacher",
          confirmed: true,
        },
        {merge: true}
      );

      await setDoc(
        doc(db, "teacher-invitations", email),
        {
          confirmed: true,
          uid: user.uid,
        },
        {merge: true}
      );

      router.push("/redirect");
      setLoading(false);
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TransparentLoadingComponent />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-3xl">
        Teacher Login
        <span className="text-amber-300 text-3xl font-black">.</span>
      </div>

      <div className="w-[80%] md:w-[50%] lg:w-[25%]">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-8">
          <label className="text-lg font-medium">Email.</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="outline-none p-3 md:p-4 border-2 border-gray-300 rounded-lg"
            placeholder="abc@xyz.com"
          />
          <label className="text-lg font-medium">Password.</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 md:p-4 outline-none border-2 border-gray-300 rounded-lg"
            placeholder="@@@@@@"
          />
          <button
            type="submit"
            className="hover:bg-amber-300 transition-all ease-linear bg-white text-black border-black cursor-pointer border-2 p-3 md:p-4 rounded-lg font-semibold text-lg"
          >
            Login
          </button>
          <div className=" flex flex-col gap-5">
            {validToken && (
              <div className="p-4 bg-green-500/20 text-white rounded-xl">
                ⓘ Token is valid.
              </div>
            )}
            {error && (
              <p className="bg-red-500/20 text-white text-center p-4 rounded-xl">
                ⓘ {error}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherLogin;
