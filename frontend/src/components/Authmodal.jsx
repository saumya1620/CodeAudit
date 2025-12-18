import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AuthModal = ({ onClose }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await fetch("http://localhost:5000/api/auth/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    login(data.token);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 w-[350px] rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-white">Login / Signup</h2>

        <input
          className="w-full mb-3 p-2 bg-zinc-800 rounded"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 bg-zinc-800 rounded"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-purple-600 p-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
