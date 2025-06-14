"use client";

import Image from "next/image";
import React, {useEffect} from "react";
import PRINCIPLE from "../../public/assets/principle.png";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import Modal from "./modal";
import {onAuthStateChanged, signOut} from "@firebase/auth";
import {auth, db} from "../../firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import {FaClipboardList} from "react-icons/fa";
import {PiTarget} from "react-icons/pi";
import {MdChat} from "react-icons/md";

function StudentNavbar({children}) {
  const routes = [
    {
      name: "Dashboard",
      path: "/student-dashboard",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 11h8V3H3zm2-6h4v4H5zm8-2v8h8V3zm6 6h-4V5h4zM3 21h8v-8H3zm2-6h4v4H5zm13-2h-2v3h-3v2h3v3h2v-3h3v-2h-3z"
          />
        </svg>
      ),
    },
    {
      name: "Chat",
      path: "/student-dashboard/chat",
      svg: <MdChat />,
    },
    // {
    //   name: "Manage Students",
    //   path: "/student-dashboard/manage-students",
    //   svg: (
    //     <svg
    //       fill="currentColor"
    //       width="24px"
    //       height="24px"
    //       viewBox="0 0 256 256"
    //       id="Flat"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path d="M224,64,128,96,32,64l96-32Z" opacity="0.2" />
    //       <path d="M226.52979,56.41016l-96-32a8.00672,8.00672,0,0,0-5.05958,0L29.6239,56.35889l-.00976.00341-.14393.04786c-.02819.00927-.053.02465-.08105.03442a7.91407,7.91407,0,0,0-1.01074.42871c-.03748.019-.07642.03516-.11353.05469a7.97333,7.97333,0,0,0-.93139.58325c-.06543.04688-.129.09522-.19288.144a8.09113,8.09113,0,0,0-.81872.71119c-.02374.02416-.04443.05053-.06787.0747a8.03121,8.03121,0,0,0-.66107.783c-.04157.05567-.0846.10986-.12476.16675a8.00867,8.00867,0,0,0-.56714.92993c-.02582.04981-.04809.10083-.07287.15112a7.93932,7.93932,0,0,0-.40522.97608c-.01062.03149-.0238.06128-.034.093a7.95072,7.95072,0,0,0-.26288,1.08544c-.01337.07666-.024.15308-.0351.23A8.02889,8.02889,0,0,0,24,64v80a8,8,0,0,0,16,0V75.09985L73.58514,86.29492a63.97188,63.97188,0,0,0,20.42945,87.89746,95.88127,95.88127,0,0,0-46.48383,37.4375,7.9997,7.9997,0,1,0,13.40235,8.73828,80.023,80.023,0,0,1,134.1333,0,7.99969,7.99969,0,1,0,13.40234-8.73828,95.87928,95.87928,0,0,0-46.48346-37.43725,63.97209,63.97209,0,0,0,20.42957-87.89771l44.11493-14.70508a8.0005,8.0005,0,0,0,0-15.17968ZM176,120A48,48,0,1,1,89.34875,91.54932l36.12146,12.04052a8.00672,8.00672,0,0,0,5.05958,0l36.12146-12.04052A47.85424,47.85424,0,0,1,176,120Zm-9.29791-45.3335c-.01984.00708-.03992.01294-.05976.02L128,87.56738,89.35785,74.68652c-.02033-.00732-.04083-.01318-.06122-.0205L57.29834,64,128,40.43262,198.70166,64Z" />
    //     </svg>
    //   ),
    // },
    {
      name: "View Timetable",
      path: "/student-dashboard/view-timetable",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
        >
          <path
            fill="currentColor"
            d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V10h14zm0-12H5V6h14zM9 14H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2zm-8 4H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2z"
          ></path>
        </svg>
      ),
    },
    {
      name: "View Attendance",
      path: "/student-dashboard/view-attendance",
      svg: <FaClipboardList />,
    },
    // {
    //   name: "Manage Assignment",
    //   path: "/student-dashboard/manage-assignment",
    //   svg: <PiTarget />,
    // },
    // {
    //   name: "Invitations",
    //   path: "/student-dashboard/invitations",
    //   svg: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       xmlSpace="preserve"
    //       id="Layer_1"
    //       width="24px"
    //       height="24px"
    //       fill="currentColor"
    //       version="1.1"
    //       viewBox="0 0 512 512"
    //     >
    //       <path d="M498.016 187.294 434.087 133.9v-28.215c0-21.481-17.476-38.957-38.957-38.957h-41.466l-65.159-54.421c-18.855-16.087-46.162-16.085-65.017.006L158.335 66.73H116.87c-21.481 0-38.957 17.476-38.957 38.957V133.9l-63.929 53.395C5.334 194.519 0 205.393 0 217.194V461.67c0 27.618 22.469 50.087 50.087 50.087h411.826c27.618 0 50.087-22.469 50.087-50.087V217.194a38.99 38.99 0 0 0-13.984-29.9m-63.929-9.888 35.172 29.378-35.172 29.377zM244.972 37.876q.083-.068.162-.138c6.295-5.395 15.435-5.396 21.731 0q.08.07.162.138l34.547 28.853h-91.149zM111.304 141.604v-35.918a5.57 5.57 0 0 1 5.565-5.565h278.26a5.57 5.57 0 0 1 5.565 5.565V264.05L267.028 375.69l-.162.138c-6.295 5.397-15.435 5.396-21.731 0q-.08-.07-.162-.138L111.304 264.049zm-33.391 35.802v58.753l-35.172-29.377zm400.696 284.263c0 9.206-7.49 16.696-16.696 16.696H50.087c-9.206 0-16.696-7.49-16.696-16.696V242.481l190.096 158.771c18.851 16.088 46.154 16.098 65.014.01l139.508-116.518.009-.008 50.591-42.257z"></path>
    //       <path d="M333.913 211.425c0-42.961-34.951-77.913-77.913-77.913s-77.913 34.952-77.913 77.913c0 39.313 29.273 71.898 67.162 77.154l-7.483 14.966c-1.85 3.701.84 8.054 4.978 8.054h26.513c4.137 0 6.827-4.353 4.978-8.054l-7.483-14.966c37.889-5.255 67.161-37.841 67.161-77.154M256 255.947c-24.549 0-44.522-19.972-44.522-44.522S231.45 166.903 256 166.903s44.522 19.972 44.522 44.522-19.973 44.522-44.522 44.522"></path>
    //     </svg>
    //   ),
    // },
    {
      name: "Profile",
      path: "/student-dashboard/profile",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2"></path>
            <path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6"></path>
          </g>
        </svg>
      ),
    },

    // {name: "Settings", path: "/admin-dashboard/settings"},
  ];
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const currentRoute = usePathname();
  // TODO CHANGE THIS LATER TO MODULE

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then((docSnap) => {
          console.log(docSnap);

          if (docSnap.exists()) {
            const userData = docSnap.data();

            if (userData.type !== "student") {
              router.replace("/redirect");
            }
          } else {
            console.log("No such document!");
          }
        });
      } else {
        router.replace("/redirect");
      }
    });
  }, []);
  //   const currentRoute = routes.find((route) => route.path === url);
  return (
    <div className="flex h-full">
      {confirmOpen && (
        <Modal
          title={"Confirm Logout"}
          desc={"Are you sure you want to logout ?"}
          cancellable={true}
          onConfirm={() => {
            signOut(auth);
          }}
          onClose={() => setConfirmOpen(false)}
        />
      )}
      <div className=" shadow-xl bg-[#1B1C21] h-screen  md:w-[25vw] lg:w-[20vw] overflow-y-hidden ">
        <div className=" h-[85%]">
          <div className="p-5 flex items-center align-bottom  ">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="50px"
                height="50px"
              >
                <path
                  fill="#3A3E4C"
                  fillRule="evenodd"
                  d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className=" font-ubuntu pl-5 text-2xl">Student</div>
          </div>
          <div className="flex flex-col justify-between  h-full">
            <div>
              {routes.map((route, index) => {
                return (
                  <Link
                    href={route.path}
                    key={index}
                    className={`flex items-center gap-3 p-3 m-3 text-gray-400 ${
                      currentRoute === route.path
                        ? "bg-[#17191f] text-white"
                        : "bg-transparent"
                    } hover:bg-[#17191F] rounded-lg hover:text-white cursor-pointer`}
                  >
                    <div className="text-2xl">{route.svg}</div>

                    <div>{route.name}</div>
                  </Link>
                );
              })}
            </div>
            {/* logout */}
            <div>
              <div
                onClick={() => setConfirmOpen(true)}
                className={`flex items-center gap-3 p-3 m-3 text-gray-400  hover:bg-[#17191F] rounded-lg hover:text-white cursor-pointer`}
              >
                <div className="text-2xl">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 12H2m0 0 3.5-3M2 12l3.5 3"
                    ></path>
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      d="M9.002 7c.012-2.175.109-3.353.877-4.121C10.758 2 12.172 2 15 2h1c2.829 0 4.243 0 5.122.879C22 3.757 22 5.172 22 8v8c0 2.828 0 4.243-.878 5.121-.769.769-1.947.865-4.122.877M9.002 17c.012 2.175.109 3.353.877 4.121.641.642 1.568.815 3.121.862"
                    ></path>
                  </svg>
                </div>

                <div>Logout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-h-screen overflow-y-scroll ">{children}</div>
    </div>
  );
}

export default StudentNavbar;
