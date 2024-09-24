import React, { useState } from "react";
import "./LoginPage.css";
import logo from "./Image/logo-svcc.png";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { auth } from "../Connection/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Connection/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    console.log({
      full_name,
      email,
      phone_number,
      address,
      user_type,
      username,
    });

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        full_name,
        email,
        phone_number,
        address,
        username,
        user_type, 
      });

      message.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success("Login successful!");
      navigate("/dashboard");
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
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
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
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <img className="logo" src={logo} alt="SVCC logo" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>SVCC Library System</h1>
              <p>Enter your personal details to use all the site features</p>
              <button className="hidden" onClick={handleClick} id="login">
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
              <button className="hidden" onClick={handleRegisterClick} id="register">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
