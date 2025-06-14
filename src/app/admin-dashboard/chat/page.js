"use client";
import React, {useEffect} from "react";
import Chat from "../../../../screens/chat";
import {fetchUser, fetchUserData} from "../../../../utils/fetchUserFunctions";
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import ChatPage from "../../../../screens/chat";

function Page() {
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const fetchInit = async () => {
      const user = await fetchUser();
      const userDetails = await fetchUserData(user.uid);
      setUserData(userDetails);
      setLoading(false);
      console.log("User data fetched:", userDetails);
    };
    fetchInit();
  }, []);
  if (loading || !userData) {
    return (
      <div className="fixed top-0 left-0 w-screen flex justify-center items-center h-screen">
        <div className="text-white h-screen w-full flex justify-center items-center">
          <TransparentLoadingComponent />
        </div>
      </div>
    );
  }
  return (
    <div>
      <ChatPage access={"admin"} user={userData} />
    </div>
  );
}

export default Page;
