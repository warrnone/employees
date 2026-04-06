"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { swalSuccess , swalError } from "../components/Swal";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }
      swalSuccess("Login สำเร็จ");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      swalError(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-3xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center bg-slate-900 text-white">
            <h1 className="text-3xl font-bold tracking-tight">
              Employee Master
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              Sign in to access the system
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-2xl py-3 text-sm font-semibold text-white transition-all ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500">
              <p className="font-semibold text-slate-700 mb-1">Demo Account</p>
              <p>Username: admin</p>
              <p>Password: 1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}