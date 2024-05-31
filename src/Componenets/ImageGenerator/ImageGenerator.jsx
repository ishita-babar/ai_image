import React, { useRef, useState, useEffect } from 'react';
import { auth } from '../firebase';
import './ImageGenerator.css';
import pic from '../Assets/pic.png';
import logo from '../Assets/logo.png'; // Import your logo image

const ImageGenerator = () => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState("/");
  const [prompt, setPrompt] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false); // Add showProfileModal state
  const inputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal);
  };

  const imageGenerator = async () => {
    const promptValue = inputRef.current.value.trim();
    if (!promptValue) {
      console.log("Prompt is empty");
      return;
    }

    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!apiKey) {
      console.error("API key is missing");
      return;
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            dangerouslyAllowAPIKeyInBrowser: true,
          },
          body: JSON.stringify({
            prompt: promptValue,
            n: 1,
            size: "512x512",
          }),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error generating image:", errorDetails);
        return;
      }

      const data = await response.json();
      console.log(data);
      if (data && data.data && data.data.length > 0) {
        setImageUrl(data.data[0].url);
        setPrompt(promptValue); // Set prompt only when user-generated image is shown
      } else {
        console.error("No image URL found in the response");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className='ai-image-generator'>
      {/* Logo at top left */}
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      
      <div className='header'> AI Image <span>Generator</span>
        <button className="profile-button" onClick={toggleProfileModal}>
          Profile
        </button>
      </div>
      {showProfileModal && (
        <div className="profile-modal">
          <h2>User Profile</h2>
          <p>Email: {user.email}</p>
          <p>Username: {user.displayName}</p>
        </div>
      )}
      {/* Display user-generated image or default image */}
      <div className="img-loading">
        <div className="image">
          <img src={imageUrl === "/" ? pic : imageUrl} alt="generated" />
        </div>
      </div>
      {imageUrl !== "/" && ( // Only show prompt when user-generated image is shown
        <div className="prompt">
          {/* Display user's prompt */}
          <p>Prompt: {prompt}</p>
        </div>
      )}
      <div className="search-box">
        <input type="text" ref={inputRef} className='search-input' placeholder='Enter Prompt' />
        <div className="generate-btn" onClick={imageGenerator}>Generate</div>
      </div>
      <div className="logout">
        {/* Render logout button at the bottom */}
        {user && <button className="logout-button" onClick={handleLogout}>Logout</button>}
      </div>
      
      {/* Footer */}
      <footer className="footer">
        &copy; Ishita Babar {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default ImageGenerator;
