import React from "react";
import "../styles/loader.css";
function LoadingScreen() {
  return (
    <div className=" flex gap-8 flex-col h-screen w-screen justify-center items-center bg-black">
      <div className="loader">
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
      </div>
      <div className="text-white text-xs font-bold">
        Hang Tight! We are getting things ready for you.
      </div>
    </div>
  );
}

export default LoadingScreen;
