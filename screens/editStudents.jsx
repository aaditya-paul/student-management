"use client";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import PFP from "../public/assets/user.png";
import {
  TransparentLoadingComponent,
  TransparentLoadingScreen,
} from "@/components/loadingScreen";
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {db} from "../firebaseConfig";
import BRANCHES from "../branch.json";
import {useRouter, useSearchParams} from "next/navigation";
function EditStudent({type}) {
  if (type === "") {
    throw new Error("Type is required");
  } else if (type !== "admin" && type !== "student" && type !== "teacher") {
    throw new Error("Type must be either 'admin' or 'student' or 'teacher'");
  }

  const [imagePreview, setImagePreview] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState();
  const [regNo, setRegNo] = useState("");
  const [semester, setSemester] = useState("");
  const router = useRouter();
  // const emailQ = useSearchParams().get("email");
  const uid = useSearchParams().get("uid");
  useEffect(() => {
    if (type === "teacher") {
      setEnvironment("teacher-dashboard");
    } else if (type === "admin") {
      setEnvironment("admin-dashboard");
    } else if (type === "student") {
      setEnvironment("student-dashboard");
    }
  }, [type]);
  useEffect(() => {
    // console.log("emailQ", emailQ);
    getDoc(doc(db, "users", uid)).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhone(data.phone);
        setBranch(data.branch);
        setRegNo(data.regNo);
        setSemester(data.semester);
      } else {
        console.log("No such document!");
      }
    });
  }, [uid]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !branch ||
      !regNo ||
      !semester
    ) {
      alert("Please fill in all the fields except the image.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    setDoc(
      doc(db, "users", uid),
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        branch: branch,
        regNo: regNo,
        semester: semester,
        // TODO add image to firebase storage and get the url
      },
      {merge: true}
    )
      .then(() => {
        alert("Student added successfully.");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setBranch("");
        setImagePreview(null);
        setImage(null);
        setLoading(false);
        setRegNo("");
        setSemester("");

        if (type === "student") {
          router.push(`/${environment}/profile`);
        } else {
          router.push(`/${environment}/manage-students`);
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Error adding student. Please try again.");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TransparentLoadingComponent />
      </div>
    );
  }

  if (
    uid === null ||
    firstName === "" ||
    lastName === "" ||
    email === "" ||
    phone === "" ||
    branch === "" ||
    regNo === "" ||
    semester === ""
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TransparentLoadingScreen />
      </div>
    );
  }

  return (
    <div>
      <div className="p-5 max-h-screen ">
        <div>
          <h1 className="text-4xl font-bold  text-amber-300">Edit Student.</h1>
          <p className="text-sm">The {type} can Edit students in the system.</p>
        </div>
        <div className=" flex md:flex-col-reverse lg:flex-row gap-5">
          <div className="flex flex-col gap-8 mt-12">
            <div className="  flex md:flex-col lg:flex-row gap-5">
              <div>
                <div className=" text-gray-400 text-xl font-semibold">
                  First Name
                </div>
                <input
                  type="text"
                  className=" outline-none p-3 md:p-4 border-2 border-slate-700 rounded-lg mt-2 w-96"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <div className=" text-gray-400 text-xl font-semibold">
                  Last Name
                </div>
                <input
                  type="text"
                  className=" outline-none p-3 md:p-4 border-2 border-slate-700 rounded-lg mt-2 w-96"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="  flex md:flex-col lg:flex-row gap-5">
              <div>
                <div className=" text-gray-400 text-xl font-semibold">
                  Email Address
                </div>
                <input
                  type="email"
                  className=" outline-none p-3 md:p-4 border-2 border-slate-700 rounded-lg mt-2 w-96"
                  placeholder="john@doe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className=" text-gray-400 text-xl font-semibold">
                  Phone Number
                </div>
                <input
                  type="number"
                  className=" outline-none p-3 md:p-4 border-2 border-slate-700 rounded-lg mt-2 w-96"
                  placeholder="+91 1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="flex md:flex-col lg:flex-row gap-5 lg:items-center">
              <div>
                <div className="text-gray-400 text-xl font-semibold">
                  Branch/Subject
                </div>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="outline-none bg-[#090C15] p-3 text-gray-400 md:p-4 border-2 border-slate-700 rounded-lg mt-2 w-96"
                >
                  <option value="">Select Branch/Subject</option>
                  {/* <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="ME">Mechanical (ME)</option>
                  <option value="CE">Civil (CE)</option>
                  <option value="EE">Electrical (EE)</option>
                  <option value="Math">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option> */}
                  {BRANCHES.map((branch, index) => (
                    <option key={index} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="  flex md:flex-col lg:flex-row gap-5">
                <div>
                  <div className=" text-gray-400 text-xl font-semibold">
                    Registration Number
                  </div>
                  <input
                    type="text"
                    className=" outline-none p-3 md:p-4 border-2 border-slate-700 rounded-lg mt-2 w-96"
                    placeholder="D232407598"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex md:flex-col  gap-5 ">
              <div>
                <div className="text-gray-400 text-xl font-semibold">
                  Semester
                </div>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="outline-none bg-[#090C15] p-3 text-gray-400 md:p-4 border-2 border-slate-700 rounded-lg mt-2 w-96"
                >
                  <option value="">Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  {/* {BRANCHES.map((branch, index) => (
                      <option key={index} value={branch.value}>
                        {branch.label}
                      </option>
                    ))} */}
                </select>
              </div>
              <div>
                <div className="text-gray-400 text-xl  font-semibold p-4 pb-0 bg-transparent">
                  {/* Submit */}
                </div>
                <div
                  onClick={handleSubmit}
                  className="text-white w-96 text-xl cursor-pointer active:scale-95 transition-all ease-linear font-semibold p-4 rounded-lg text-center bg-[#D03035]"
                >
                  Submit
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mt-12 px-5">
              <label className="text-gray-400 text-xl flex flex-col lg:justify-center lg:items-center mb-5 font-semibold mt-4">
                Upload Image
              </label>

              <div className="flex flex-col lg:items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  placeholder="Upload Image"
                  id="pfpinput"
                  className="border-2 hidden border-slate-700 p-2 rounded-lg"
                />
                <label htmlFor="pfpinput" className="cursor-pointer">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={240}
                      height={240}
                      className="w-60 h-60 object-cover rounded-full border-2 border-gray-600"
                    />
                  ) : (
                    <Image
                      src={PFP}
                      alt="Default Preview"
                      width={240}
                      height={240}
                      className="w-60 h-60 invert-50 object-cover rounded-full border-2 border-gray-600"
                    />
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditStudent;
