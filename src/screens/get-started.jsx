import Image from "next/image";
import React from "react";
import Student from "../../public/assets/student.png";
import Teacher from "../../public/assets/teacher.png";
import {motion} from "motion/react";
import Link from "next/link";
function GetStarted() {
  return (
    <div className="flex z-20 flex-col items-center justify-center h-screen ">
      <div className=" mb-12 text-white text-4xl">
        Who Are You <span className="  text-amber-300">?</span>
      </div>
      <div className="flex flex-row gap-24 mt-4 justify-center items-center p-10">
        <Link
          href={"/login?type=student"}
          className=" cursor-pointer  flex flex-col gap-2 justify-center items-center"
        >
          <motion.div
            whileHover={{
              x: [0, -2, 2, -2, 2, 0],
            }}
            className=" p-5 border-2 hover:border-blue-100 border-transparent  bg-black rounded-full w-48 h-48 overflow-clip justify-center items-center"
          >
            <Image
              style={{objectFit: "contain"}}
              src={Student}
              width={192}
              height={192}
              alt="Student Image"
            />
          </motion.div>
          <div className="font-cursive text-green-200">A Student</div>
        </Link>
        <div className=" text-blue-300 font-cursive text-2xl">or</div>
        <Link
          href={"/login?type=teacher"}
          className=" cursor-pointer flex flex-col gap-2 justify-center items-center"
        >
          <motion.div
            whileHover={{
              x: [0, -2, 2, -2, 2, 0],
            }}
            className="p-5 border-2 hover:border-blue-100  border-transparent  bg-black rounded-full w-48 h-48 overflow-clip justify-center items-center"
          >
            <Image
              style={{objectFit: "cover", position: "relative", top: "20px"}}
              width={192}
              height={192}
              src={Teacher}
              alt="Teacher Image"
            />
          </motion.div>
          <div className="font-cursive text-amber-200">A Teacher</div>
        </Link>
      </div>
    </div>
  );
}

export default GetStarted;
