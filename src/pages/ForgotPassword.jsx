// pages/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import { server } from "../server";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${server}/user/forgot-password`, { email });
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default ForgotPassword;
