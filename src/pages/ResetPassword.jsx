// pages/ResetPassword.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${server}/user/reset-password`, { token, newPassword });
      toast.success("Password reset successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Enter new password" />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
