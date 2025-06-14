// NoticeBoard.jsx
"use client";

import React, {useState, useEffect} from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc, // Import deleteDoc for deleting documents
  doc, // Import doc for creating document references
} from "@firebase/firestore";
import {db} from "../../firebaseConfig"; // Ensure this path is correct
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import {IoSend} from "react-icons/io5"; // Assuming IoSend is used for the send button icon

// Utility function to capitalize first letter (re-used)
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
};

function NoticeBoard({
  currentUserUid,
  access,
  currentUserFirstName,
  currentUserLastName,
}) {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [newNoticeContent, setNewNoticeContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Permissions check for adding notices
  const canAddNotice = access === "admin" || access === "teacher";

  // Fetch notices in real-time
  useEffect(() => {
    setLoading(true);
    const noticesCollectionRef = collection(db, "notices");
    const q = query(noticesCollectionRef, orderBy("createdAt", "desc")); // Order by latest first

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedNotices = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotices(fetchedNotices);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notices:", error);
        setErrorMessage("Failed to load notices. Please try again.");
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handler for adding a new notice
  const handleAddNotice = async () => {
    if (!canAddNotice) {
      setErrorMessage("You do not have permission to add notices.");
      return;
    }
    if (!newNoticeContent.trim()) {
      setErrorMessage("Notice content cannot be empty.");
      return;
    }
    if (!currentUserUid || !currentUserFirstName || !currentUserLastName) {
      setErrorMessage("User information missing. Cannot add notice.");
      return;
    }

    setErrorMessage(""); // Clear any previous error messages
    try {
      await addDoc(collection(db, "notices"), {
        content: newNoticeContent.trim(),
        createdAt: serverTimestamp(),
        createdByUid: currentUserUid,
        createdByFirstName: currentUserFirstName,
        createdByLastName: currentUserLastName,
        createdByRole: access, // Store the role for styling and permission checks
      });
      setNewNoticeContent(""); // Clear input after adding
    } catch (error) {
      console.error("Error adding notice:", error);
      setErrorMessage("Failed to add notice. Please try again.");
    }
  };

  // Handler for deleting a notice
  const handleDeleteNotice = async (noticeId, createdByUid, createdByRole) => {
    // Check if the current user has permission to delete this specific notice
    const isAdmin = access === "admin";
    const isTeacher = access === "teacher";
    const isOwner = createdByUid === currentUserUid; // Check if the current user created this notice

    if (!isAdmin && !(isTeacher && isOwner)) {
      alert("You do not have permission to delete this notice.");
      return;
    }

    // Confirmation dialog before proceeding with deletion
    // IMPORTANT: In a production app, you might want a custom modal instead of window.confirm
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      // Get a reference to the specific notice document and delete it
      await deleteDoc(doc(db, "notices", noticeId));
      alert("Notice deleted successfully!");
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Failed to delete notice. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TransparentLoadingComponent />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[95vh] p-5 bg-white/10 text-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-amber-300 mb-6">Notice Board</h2>

      {/* Scrollable Notice List */}
      <div className="flex-1 overflow-y-auto mb-4 hide-scrollbar">
        {" "}
        {/* Added hide-scrollbar for cleaner look */}
        {notices.length === 0 && !loading ? (
          <p className="text-gray-400 text-center py-8">
            No notices available.
          </p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => {
              // Determine if the delete button should be shown for this notice
              const canDelete =
                access === "admin" || // Admin can delete any notice
                (access === "teacher" &&
                  notice.createdByUid === currentUserUid); // Teacher can delete only their own

              return (
                <div
                  key={notice.id}
                  className={`p-4 rounded-lg shadow-md relative ${
                    // 'relative' for absolute positioning of delete button
                    notice.createdByRole === "admin"
                      ? "bg-orange-500" // Admin notices: Orange
                      : "bg-yellow-500 text-gray-900" // Teacher notices: Yellow
                  }`}
                >
                  <p className="text-lg font-medium mb-2">{notice.content}</p>
                  <div className="text-sm text-right">
                    <span className="font-semibold">
                      {capitalizeFirstLetter(notice.createdByFirstName)}{" "}
                      {capitalizeFirstLetter(notice.createdByLastName)} (
                      {capitalizeFirstLetter(notice.createdByRole)})
                    </span>
                    {notice.createdAt && (
                      <span className="block text-xs">
                        {new Date(notice.createdAt.toDate()).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {/* Delete button, visible only if allowed */}
                  {canDelete && (
                    <button
                      onClick={() =>
                        handleDeleteNotice(
                          notice.id,
                          notice.createdByUid,
                          notice.createdByRole
                        )
                      }
                      className="absolute top-2 right-2 px-3 py-1 bg-red-700 text-white text-xs rounded-md cursor-pointer
                       hover:bg-red-800 transition-colors"
                      title="Delete this notice"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Add Notice Section (Input and Send Button) */}
      {canAddNotice && (
        <div>
          <div className="rounded-lg items-start w-full flex gap-2">
            <textarea
              className="w-full p-3 min-h-16 max-h-52 bg-transparent border-2 border-amber-300/50 rounded-lg text-white placeholder-gray-500 outline-none focus:border-amber-300"
              rows="1" // Starts with 1 row, expands with content up to max-h-52
              placeholder="Write your notice here..."
              value={newNoticeContent}
              onChange={(e) => setNewNoticeContent(e.target.value)}
            ></textarea>

            <button
              onClick={handleAddNotice}
              className="px-6 py-3 h-16 border border-amber-300 hover:bg-amber-300 hover:text-black text-white font-semibold rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center"
            >
              <IoSend size={24} />{" "}
              {/* Increased icon size for better visibility */}
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default NoticeBoard;
