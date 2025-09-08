"use client";
import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength indicator
  interface PasswordStrength {
    strength: "weak" | "medium" | "strong";
    color: string;
    bg: string;
  }

  const getPasswordStrength = (pass: string): PasswordStrength => {
    if (pass.length < 6)
      return { strength: "weak", color: "text-red-500", bg: "bg-red-500" };
    if (pass.length < 10 && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass))
      return {
        strength: "medium",
        color: "text-yellow-500",
        bg: "bg-yellow-500",
      };
    return { strength: "strong", color: "text-green-500", bg: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  interface OnSubmitEvent extends React.FormEvent<HTMLButtonElement> {}

  async function onSubmit(e: OnSubmitEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      console.log("Registration attempted:", { email, password, name });
      alert("Registration successful! (This is a demo)");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-5 w-16 h-16 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
      <div
        className="absolute top-20 right-10 w-12 h-12 bg-purple-200 rounded-full opacity-50"
        style={{ animation: "pulse 2s infinite", animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 left-10 w-14 h-14 bg-green-200 rounded-full opacity-40"
        style={{ animation: "pulse 2s infinite", animationDelay: "3s" }}
      ></div>
      <div
        className="absolute bottom-10 right-5 w-20 h-20 bg-indigo-200 rounded-full opacity-40"
        style={{ animation: "pulse 2s infinite", animationDelay: "1s" }}
      ></div>

      <div className="flex flex-col min-h-screen py-4 px-4 sm:px-6 lg:px-8">
        {/* Back to Home Link */}
        <div className="mb-4">
          <button className="inline-flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 group">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Register Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600 text-sm">
                  Join thousands managing their finances with FinanceTracker
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-900"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-900"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-900"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">
                          Password strength
                        </span>
                        <span
                          className={`text-xs font-medium ${passwordStrength.color}`}
                        >
                          {passwordStrength.strength === "weak" && "Weak"}
                          {passwordStrength.strength === "medium" && "Medium"}
                          {passwordStrength.strength === "strong" && "Strong"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${passwordStrength.bg} transition-all duration-300`}
                          style={{
                            width:
                              passwordStrength.strength === "weak"
                                ? "33%"
                                : passwordStrength.strength === "medium"
                                ? "66%"
                                : "100%",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>

                {/* Register Button */}
                <button
                  onClick={onSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-700 font-medium">
                  Already have an account?{" "}
                  <button className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline hover:cursor-pointer">
                    <Link href="/login">sign in here</Link>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
