"use client";
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../index.css";
import styles from "./Dashboard.module.css";
import SideBar from "../components/SideBar";

export default function ProfilePage() {
  const [onLogin, user, check_session] = useOutletContext();
  const [userData, setUserData] = useState(user);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  

  // 🔹 Update profile (Name & Password)
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://your-backend.com/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName, password: newPassword }),
      });

      if (!response.ok) throw new Error("Failed to update profile.");
      setUserData((prev) => ({ ...prev, name: newName }));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile Update Error:", error.message);
      alert("Failed to update profile: " + error.message);
    }
    setLoading(false);
  };

  // 🔹 Upload Profile Picture
  const handleUploadImage = async () => {
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("profilePic", imageFile);

    try {
      const response = await fetch("https://your-backend.com/api/upload-profile-pic", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Image upload failed.");
      const { profilePic } = await response.json();

      setUserData((prev) => ({ ...prev, profilePic }));
      alert("Profile picture updated!");
    } catch (error) {
      console.error("Image Upload Error:", error.message);
      alert("Failed to upload image.");
    }
    setUploading(false);
  };

  // 🔹 Remove Profile Picture
  const handleRemoveProfilePicture = async () => {
    if (!userData.profilePic) {
      alert("No profile picture to remove.");
      return;
    }

    if (!window.confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    try {
      const response = await fetch("https://your-backend.com/api/remove-profile-pic", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to remove profile picture.");
      setUserData((prev) => ({ ...prev, profilePic: "" }));

      alert("Profile picture removed successfully.");
    } catch (error) {
      console.error("Remove Picture Error:", error.message);
      alert("Failed to remove profile picture.");
    }
  };
  if (!user) {
    return (
        <div className="account-loader">
          <div className="spinner"></div>
        </div>
    );
}

  return (
    <>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    
    {/* Create a wrapper container with flexbox */}
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }} className="app-layout">

      {/* Your sidebar/dashboard */}
      <SideBar user={user} />
      
      {/* Main content area */}
     
     
      <main className={styles.container}>
        <section className={styles.projectsSection}>
          <h2 className={styles.sectionTitle}>profile Page:</h2>
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center">Profile Settings</h2>

        <div className="mt-4 flex flex-col items-center">
          {userData.profilePic ? (
            <>
              <img src={userData.profilePic} alt="Profile" className="w-24 h-24 rounded-full border border-gray-300" />
              <button
                onClick={handleRemoveProfilePicture}
                disabled={uploading}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                {uploading ? "Removing..." : "Remove Picture"}
              </button>
            </>
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="mt-2" />
          <button onClick={handleUploadImage} disabled={uploading} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <div className="mt-4">
          <p><strong>Email:</strong> {userData.email || "Not provided"}</p>
          <p><strong>Role:</strong> {userData.role || "Not specified"}</p>
        </div>

        <div className="mt-4">
          <label className="block font-bold">Full Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mt-4">
          <label className="block font-bold">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
        </section>

        <aside className={styles.rightSidebar}>
          {/* ...announcements and trending sections... */}
          
        </aside>
      </main>
      
    
    </div>
    
  </>
  );
}
