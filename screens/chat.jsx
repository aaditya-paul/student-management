// Example usage in a parent component (e.g., app/chat/page.jsx)
// You would fetch user data and pass it here.
import ChatBox from "@/components/ChatBox"; // Adjust path
import {fetchUser, fetchUserData} from "../utils/fetchUserFunctions"; // Your user utility functions
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import React, {useState, useEffect} from "react";

function ChatPage({access = "student", user = null}) {
  if (
    (access !== "student" && access !== "teacher" && access !== "admin") ||
    access === null ||
    access === undefined ||
    access === ""
  ) {
    throw new Error("Invalid access type provided to ChatPage component.");
  }

  //   const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  //   useEffect(() => {
  //     const getUserData = async () => {
  //       setLoadingUser(true);
  //       try {
  //         const authUser = await fetchUser(); // Get authenticated user from Firebase Auth
  //         if (authUser) {
  //           const userData = await fetchUserData(authUser.uid); // Fetch user details from Firestore
  //           setUser(userData);
  //         } else {
  //           // Handle unauthenticated state, e.g., redirect to login
  //           console.log("No authenticated user.");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       } finally {
  //         setLoadingUser(false);
  //       }
  //     };
  //     getUserData();
  //   }, []);

  if (!user) {
    return (
      <div className=" h-screen w-full flex justify-center items-center">
        <TransparentLoadingComponent />
      </div>
    );
  }

  // Ensure user object is valid before rendering ChatBox
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Please log in to access the chat.
      </div>
    );
  }

  return (
    <ChatBox
      currentUserUid={user.uid}
      access={user.type} // e.g., "admin", "teacher", "student"
      currentUserFirstName={user.firstName || "Admin"}
      currentUserLastName={user.lastName || "."}
    />
  );
}

export default ChatPage;
