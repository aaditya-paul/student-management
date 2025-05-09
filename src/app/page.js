"use client";

import Dots from "@/components/dots";
import LoadingScreen from "@/components/loadingScreen";
import {Button} from "@/components/ui/button";
import GetStarted from "@/screens/get-started";
import LandingPage from "@/screens/landing-page";
import React from "react";

function Page() {
  return (
    <div className="">
      {/* <LoadingScreen /> */}
      <GetStarted />
      <div className=" -z-10">
        <Dots />
      </div>

      {/* <div>
        <LandingPage />
      </div> */}
    </div>
  );
}

export default Page;
