import React from "react";
import {
  TrendingUp,
  PieChart,
  Target,
  Shield,
  BarChart3,
  Wallet,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Height */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
              Take Control of Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block mt-2">
                Financial Future
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Track income, manage expenses, and visualize your spending
              patterns with our intelligent personal finance assistant. Make
              informed decisions with real-time insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-xl font-semibold text-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Get Started Free
              </a>
              <a
                href="/login"
                className="px-10 py-5 border-2 border-gray-300 rounded-xl font-semibold text-xl text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-50 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-20 w-20 h-20 bg-green-200 rounded-full opacity-40 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-40 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-5 w-12 h-12 bg-yellow-200 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Features Section - Full Height */}
      <div className="min-h-screen bg-white flex items-center py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Core Features for Financial Management
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to track, analyze, and understand your
              financial data in one comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="group p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-100 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Transaction Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Effortlessly log and categorize your income and expenses. Keep
                track of every transaction with smart categorization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border border-green-100 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Visual Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Beautiful charts and graphs that help you understand your
                spending patterns and financial trends at a glance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-300 border border-purple-100 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Budget Goals
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Set financial goals and track your progress. Stay motivated with
                clear milestones and achievement tracking.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300 border border-orange-100 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Trend Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Identify spending trends and patterns over time. Make
                data-driven decisions about your financial future.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-all duration-300 border border-teal-100 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Smart Reports
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Generate detailed financial reports with insights and
                recommendations tailored to your spending habits.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all duration-300 border border-gray-100 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Secure & Private
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Your financial data is protected with bank-level security. We
                prioritize your privacy and data protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA + Stats Section - Full Height */}
      <div className="min-h-screen flex flex-col">
        {/* CTA Section */}
        <div className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Ready to Transform Your Financial Life?
            </h2>
            <p className="text-xl sm:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of users who have already taken control of their
              finances. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/register"
                className="bg-white text-blue-600 px-10 py-5 rounded-xl font-semibold text-xl hover:bg-gray-50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Start Free Trial
              </a>
              <a
                href="/login"
                className="border-2 border-white text-white px-10 py-5 rounded-xl font-semibold text-xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:shadow-xl"
              >
                Already have an account?
              </a>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex-1 bg-gray-900 text-white flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="text-5xl lg:text-6xl font-bold text-blue-400 mb-4 group-hover:text-blue-300 transition-colors">
                  10K+
                </div>
                <div className="text-gray-300 text-lg lg:text-xl">
                  Active Users
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="text-5xl lg:text-6xl font-bold text-green-400 mb-4 group-hover:text-green-300 transition-colors">
                  $2M+
                </div>
                <div className="text-gray-300 text-lg lg:text-xl">
                  Money Tracked
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="text-5xl lg:text-6xl font-bold text-purple-400 mb-4 group-hover:text-purple-300 transition-colors">
                  50K+
                </div>
                <div className="text-gray-300 text-lg lg:text-xl">
                  Transactions
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="text-5xl lg:text-6xl font-bold text-orange-400 mb-4 group-hover:text-orange-300 transition-colors">
                  95%
                </div>
                <div className="text-gray-300 text-lg lg:text-xl">
                  User Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-6">
                FinanceTracker
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Empowering individuals to take control of their financial future
                through intelligent tracking, analysis, and insights.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-blue-400" />
                  <span>support@financetracker.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FinanceTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
