import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest(isSignup ? "/auth/signup" : "/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-8 rounded-xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-slate-800">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</p>
        )}

        {isSignup && (
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg p-2.5"
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5"
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium rounded-lg p-2.5 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
        </button>

        <p className="text-sm text-slate-600 text-center">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link
            to={isSignup ? "/login" : "/signup"}
            className="text-blue-600 font-medium"
          >
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default AuthPage;