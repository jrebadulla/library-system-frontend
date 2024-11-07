import React, { useState } from "react";
import "./LoginPage.css";
import logo from "./Image/logo-svcc.png";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { auth } from "../Connection/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../Connection/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import book from "./Image/book.svg";
import "@fortawesome/fontawesome-free/css/all.min.css";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    user_type: "",
    password: "",
    username: "",
  });

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = () => {
    setIsActive(false);
  };

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const {
      email,
      password,
      full_name,
      phone_number,
      address,
      user_type,
      username,
    } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, profilePicture);

      const profilePictureUrl = await getDownloadURL(storageRef);

      await setDoc(doc(db, "users", user.uid), {
        user_id: user.uid,
        full_name,
        email,
        phone_number,
        address,
        username,
        user_type,
        profile_picture: profilePictureUrl,
      });

      message.success("Registration successful!");
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        localStorage.setItem("full_name", userData.full_name);
        localStorage.setItem("user_type", userData.user_type);
        localStorage.setItem("user_id", userData.user_id);

        if (userData.profile_picture) {
          localStorage.setItem("profile_picture", userData.profile_picture);
        } else {
          localStorage.removeItem("profile_picture");
        }

        message.success("Login successful!");
        navigate("/dashboard");
      } else {
        message.error("No additional user details found.");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="main-container">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              aria-label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } icon`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              required
            >
              <option value="">Select User Type</option>
              <option value="College Staff">College Staff</option>
              <option value="Basic Education Staff">
                Basic Education Staff
              </option>
            </select>
            <div class="file-upload-wrapper">
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                required
                style={{ display: "none" }}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                {profilePicture
                  ? profilePicture.name
                  : "Upload Profile Picture"}
              </label>
            </div>

            <button className="send-request" type="submit">Send Request</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <img className="logo" src={logo} alt="SVCC logo" />
            <div className="input-wrapper">
              <i className="fas fa-envelope icon"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } icon`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            <a className="forget-pass">Forget Your Password?</a>
            <button aria-label="Login Button" type="submit">
              Login
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <img className="svg" src={book} alt="book" />
              <p class="welcome-message">
                Welcome to the SVCC Library System. Your gateway to unlimited
                knowledge.
              </p>
              <button className="signIn" onClick={handleClick} id="login">
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Mission</h1>
              <p>To produce patriotic graduates ready for the global economy</p>
              <h1>Vision</h1>
              <p>
                To be the leading privately managed integrated community college
                by 2030
              </p>
              <a
                className="request-account"
                onClick={handleRegisterClick}
                id="register"
              >
                Request to Register an Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
