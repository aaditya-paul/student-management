"use client";

import Dots from "@/components/dots";
import {Button} from "@/components/ui/button";
import GetStarted from "@/screens/get-started";
import React from "react";

function Page() {
  return (
    <div className="">
      <GetStarted />
      <div className=" -z-10">
        <Dots />
      </div>
    </div>
  );
}

export default Page;
