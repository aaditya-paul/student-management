"use client";
import TimetableSetter from "@/components/timetableSetter";
import React, {useEffect} from "react";
import {fetchUser} from "../../../../utils/fetchUserFunctions";

function Page() {
  const [currentUserUid, setCurrentUserUid] = React.useState(null);
  useEffect(() => {
    fetchUser()
      .then((user) => {
        setCurrentUserUid(user.uid);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);
  return (
    <div>
      <TimetableSetter
        mode="edit"
        access="admin"
        currentUserUid={currentUserUid}
      />
    </div>
  );
}

export default Page;
