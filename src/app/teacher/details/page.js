"use client";
import {useSearchParams} from "next/navigation";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import PFP from "../../../../public/assets/user.png";
import LoadingScreen, {
  TransparentLoadingComponent,
  TransparentLoadingScreen,
} from "@/components/loadingScreen";
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {auth, db} from "../../../../firebaseConfig";
import {useRouter} from "next/navigation";
import {generateUID} from "../../../../utils/uid-generator";
import {onAuthStateChanged} from "@firebase/auth";
function TeacherDetailsTokenFillup() {
  const [imagePreview, setImagePreview] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = useSearchParams().get("token");
  const uid = useSearchParams().get("uid");

  //   useEffect(() => {
  //     onAuthStateChanged(auth, (user) => {
  //       if (user) {
  //         setEmail(user.email);

  //         getDoc(doc(db, "users", user.uid)).then((docSnap) => {
  //           console.log(docSnap);

  //           if (docSnap.exists()) {
  //             const userData = docSnap.data();

  //             if (userData.type !== "teacher") {
  //               router.replace("/redirect");
  //             }
  //           } else {
  //             console.log("No such document!");
  //           }
  //         });
  //       } else {
  //         router.replace("/redirect");
  //       }
  //     });
  //   }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is logged in:", user.uid);
        getDoc(doc(db, "users", user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User data:", userData.type);
            // Perform any actions you need with the user data
          } else {
            router.push("/");
            console.log("No such document!!!!!!!!!!!!");
          }
        });
        if (user.uid !== uid) {
          alert("You are not authorized to access this link.");
          router.push("/");
        }

        setEmail(user.email);
      } else {
        alert("You are not authorized to access this link.");
        router.push("/");
      }
    });
  }, []);

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
    if (!firstName || !lastName || !email || !phone || !branch) {
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
        confirmed: true,
        uid: uid,
        type: "teacher",
        // TODO add image to firebase storage and get the url
      },
      {merge: true}
    );

    setDoc(
      doc(db, "teacher-invitations", email),
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        branch: branch,
        confirmed: true,
        uid: uid,
        // TODO add image to firebase storage and get the url
      },
      {merge: true}
    )
      .then(() => {
        alert("Teacher added successfully.");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setBranch("");
        setImagePreview(null);
        setImage(null);
        setLoading(false);
        router.push("/teacher-dashboard");
      })
      .catch((e) => {
        console.log(e);
        alert("Error adding teacher. Please try again.");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div className=" flex justify-center items-center h-screen ">
      <div className="p-5 max-h-screen ">
        <div>
          <h1 className="text-4xl font-bold  text-amber-300">
            Complete Profile.
          </h1>
          <p className="text-sm">Complete profile to for further access.</p>
          <p className="text-sm text-red-500 font-bold">
            ⓘ Do not close this tab before submitting or else this account will
            be jammed.
          </p>
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
                  readOnly
                  className=" outline-none p-3 md:p-4 border-2 border-slate-700 rounded-lg mt-2 w-96"
                  placeholder="john@doe.com"
                  value={email}
                  //   onChange={(e) => setEmail(e.target.value)}
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
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="ME">Mechanical (ME)</option>
                  <option value="CE">Civil (CE)</option>
                  <option value="EE">Electrical (EE)</option>
                  <option value="Math">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
              <div>
                <div className="text-gray-400 text-xl  font-semibold p-4 bg-transparent">
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

export default TeacherDetailsTokenFillup;
