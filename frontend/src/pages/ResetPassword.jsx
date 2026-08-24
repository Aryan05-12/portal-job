import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      `http://localhost:1111/api/reset-password/${token}`,
      { password }
    );

    alert("Password Updated");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">
        Reset Password
      </button>
    </form>
  );
}