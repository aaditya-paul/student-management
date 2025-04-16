import React from "react";
// import Image from "../..";
function AdminLogin() {
  return (
    <div className=" text-white flex flex-col items-center justify-center h-screen bg-black/96.5">
      <div className=" text-3xl">
        Admin Login
        <span className="text-amber-300 text-3xl font-black">.</span>
      </div>
      <div className=" w-[25%]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className=" flex flex-col gap-4 mt-8 "
        >
          <label className="text-lg font-medium">Email.</label>
          <input
            type="email"
            className=" outline-none p-4 border-2 border-gray-300 rounded-lg"
            placeholder="abc@xyz.com"
          />
          <label className="text-lg font-medium">Password.</label>

          <input
            type="password"
            className=" p-4 outline-none border-2 border-gray-300 rounded-lg"
            placeholder="********"
          />

          <button className=" hover:bg-amber-300  transition-all ease-linear bg-white text-black border-black cursor-pointer border-2  p-4 rounded-lg  font-semibold text-lg">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
