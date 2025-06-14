// ChatBox.jsx
"use client";

import React, {useState, useEffect, useRef} from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import {db} from "../../firebaseConfig"; // Ensure this path is correct
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import {IoSend} from "react-icons/io5"; // Icon for send button
import {FaTrashAlt} from "react-icons/fa"; // Icon for delete button

// Utility function to capitalize first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
};

function ChatBox({
  currentUserUid,
  access,
  currentUserFirstName,
  currentUserLastName,
}) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to latest message

  // Permissions check for sending messages
  const canSendMessage =
    access === "admin" || access === "teacher" || access === "student";

  // Fetch messages in real-time from Firestore
  useEffect(() => {
    setLoading(true);
    const messagesCollectionRef = collection(db, "chatMessages");
    const q = query(messagesCollectionRef, orderBy("createdAt", "asc")); // Order by oldest first

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setErrorMessage("Failed to load messages. Please try again.");
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Auto-scroll to the latest message whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  // Handler for sending a new message
  const handleSendMessage = async () => {
    if (!canSendMessage) {
      setErrorMessage("You do not have permission to send messages.");
      return;
    }
    if (!newMessageContent.trim()) {
      setErrorMessage("Message content cannot be empty.");
      return;
    }
    if (!currentUserUid || !currentUserFirstName || !currentUserLastName) {
      setErrorMessage("User information missing. Cannot send message.");
      return;
    }

    setErrorMessage(""); // Clear any previous error messages
    try {
      // Direct Firestore operation to send message
      await addDoc(collection(db, "chatMessages"), {
        content: newMessageContent.trim(),
        createdAt: serverTimestamp(),
        createdByUid: currentUserUid,
        createdByFirstName: currentUserFirstName,
        createdByLastName: currentUserLastName,
        createdByRole: access, // Store the role for styling and permission checks
      });
      setNewMessageContent(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  // Handler for deleting a message
  const handleDeleteMessage = async (
    messageId,
    createdByUid,
    createdByRole
  ) => {
    // Check if the current user has permission to delete this specific message
    const isAdmin = access === "admin";
    const isOwner = createdByUid === currentUserUid; // Check if the current user created this message

    if (!isAdmin && !isOwner) {
      // Admin can delete any, owner can delete their own
      alert("You do not have permission to delete this message.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      // Direct Firestore operation to delete message
      await deleteDoc(doc(db, "chatMessages", messageId));
      alert("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <TransparentLoadingComponent />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-5  text-white  ">
      <div className="flex-grow flex flex-col w-[90%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-amber-300 mb-6 text-center">
          Global Chat
        </h2>

        {/* Message Display Area */}
        <div className="flex-1 overflow-y-auto mb-4 p-2 custom-scrollbar">
          {" "}
          {/* Added custom-scrollbar */}
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No messages yet. Be the first to say something!
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isSentByCurrentUser =
                  message.createdByUid === currentUserUid;
                const messageBubbleClasses = isSentByCurrentUser
                  ? "bg-blue-700 ml-auto rounded-br-none" // Sent messages (default blue for sender, rounded differently)
                  : message.createdByRole === "admin"
                  ? "bg-orange-600 mr-auto rounded-bl-none" // Admin messages (orange)
                  : message.createdByRole === "teacher"
                  ? "bg-yellow-500 text-gray-900 mr-auto rounded-bl-none" // Teacher messages (yellow, with dark text)
                  : "bg-gray-700 mr-auto rounded-bl-none"; // Other received messages (default gray)

                const canDelete =
                  access === "admin" || // Admin can delete any message
                  isSentByCurrentUser; // Owner can delete their own message

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isSentByCurrentUser ? "justify-end" : "justify-start"
                    } relative`}
                  >
                    <div
                      className={`p-3 max-w-[70%] break-words rounded-lg shadow-md flex flex-col ${messageBubbleClasses}`}
                    >
                      <span className="text-xs font-bold mb-1 opacity-80">
                        {capitalizeFirstLetter(message.createdByFirstName)}{" "}
                        {capitalizeFirstLetter(message.createdByLastName)} (
                        {capitalizeFirstLetter(message.createdByRole)})
                      </span>
                      <p className="text-base">{message.content}</p>
                      {message.createdAt && (
                        <span className="text-right text-xs opacity-70 mt-1">
                          {new Date(
                            message.createdAt.toDate()
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          {new Date(
                            message.createdAt.toDate()
                          ).toLocaleDateString()}
                        </span>
                      )}
                      {canDelete && (
                        <button
                          onClick={() =>
                            handleDeleteMessage(
                              message.id,
                              message.createdByUid,
                              message.createdByRole
                            )
                          }
                          className="absolute -top-1 -right-1 p-1 bg-red-700 text-white text-xs rounded-full hover:bg-red-800 transition-colors"
                          title="Delete message"
                        >
                          <FaTrashAlt size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} /> {/* For auto-scrolling */}
            </div>
          )}
        </div>

        {/* Message Input Section */}
        {canSendMessage && (
          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="flex gap-2">
              <textarea
                className="flex-1 p-3 min-h-[40px] max-h-32 bg-gray-800 border-2 border-slate-700 rounded-lg text-white placeholder-gray-500 outline-none focus:border-amber-300 resize-none"
                rows="1"
                placeholder="Type your message..."
                value={newMessageContent}
                onChange={(e) => setNewMessageContent(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent new line
                    handleSendMessage();
                  }
                }}
              ></textarea>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-amber-300 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors flex items-center justify-center h-12 w-12"
              >
                <IoSend size={24} />
              </button>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;
