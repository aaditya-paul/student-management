import React, {use, useEffect} from "react";
import USERIMG from "../public/assets/user.png";
import Image from "next/image";
import Link from "next/link";
function Profile({userData, type}) {
  //@param {Object} userData - The user data object containing user information.
  //@param {string} type - The type of user, e.g., "admin" or "teacher".

  const [environment, setEnvironment] = React.useState(type);
  if (type === "") {
    throw new Error("Type is required");
  } else if (type != "admin" && type != "teacher" && type != "student") {
    throw new Error("Invalid type provided");
  }

  useEffect(() => {
    if (type === "teacher") {
      setEnvironment("teacher-dashboard");
    } else if (type === "student") {
      setEnvironment("student-dashboard");
    }
  }, [type]);
  return (
    <div className=" p-5 w-full h-full">
      <div className="flex justify-center items-center h-full w-full">
        <div className="bg-[#1B1C21] p-10 w-[50%] h-fit rounded-2xl shadow-2xl ">
          <div className="flex flex-col">
            <div className="">
              <div className="flex flex-row-reverse justify-between">
                <Link
                  href={`/${environment}/profile/edit?uid=${userData?.uid}`}
                  className="text-lg cursor-pointer active:scale-95 transition-all ease-linear font-bold text-black px-5 py-2 bg-amber-300 rounded-md h-fit "
                >
                  Edit
                </Link>
                {/* image */}
                <div className=" basis-3/4">
                  <Image
                    src={userData?.image || USERIMG}
                    alt="Profile"
                    className={`w-24 h-24 rounded-full mb-2 -ml-3 ${
                      userData?.image ? "" : "invert-75"
                    }`}
                  />
                </div>
              </div>
              {/* name */}
              <div className="text-3xl font-bold text-amber-300 ">
                {userData?.firstName} {userData?.lastName}
              </div>
            </div>
            {type === "teacher" && (
              <div className=" font-mono text-sm text-gray-400">
                {" "}
                Lecturer at{" "}
                <span className="text-blue-300">
                  Central Calcutta Polytechnic
                </span>
              </div>
            )}
            <div className=" font-mono text-xs text-gray-400">
              &#9432; UID : {userData?.uid}
            </div>
            <div className="mt-5 text-xl">
              <span className="font-bold ">Department :</span>
              <span className=" text-gray-300"> {userData?.branch}</span>
            </div>
            {type === "teacher" && (
              <div className="mt-5 text-xl">
                <span className="font-bold ">Subjects Taught : </span>
                <span className=" text-gray-300">
                  {userData?.subjects && userData?.subjects.length > 0
                    ? userData?.subjects.join(", ").toUpperCase()
                    : " No Subjects Assigned"}
                </span>
              </div>
            )}
          </div>
          <div className="text-xl mt-5">
            <span className="">Contact:</span>
            <ul className="ml-5 mt-2 flex flex-col gap-2 text-lg list-disc text-gray-300">
              <li>
                <Link href={`mailto:${userData?.email}`}>
                  <code className="">
                    Email:{" "}
                    <span className="text-gray-400 bg-gray-950/20 p-1 rounded-md cursor-pointer">
                      {userData?.email}
                    </span>
                  </code>
                </Link>
              </li>
              <li>
                <Link href={`tel:+91${userData?.phone}`}>
                  <code className="">
                    Phone:{" "}
                    <span className="text-gray-400 bg-gray-950/20 p-1 rounded-md cursor-pointer">
                      +91 {userData?.phone}
                    </span>
                  </code>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
