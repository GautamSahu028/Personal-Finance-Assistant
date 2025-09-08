import React from "react";
import {
  TrendingUp,
  PieChart,
  Target,
  Shield,
  BarChart3,
  Wallet,
} from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Take Control of Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block">
                Financial Future
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Track income, manage expenses, and visualize your spending
              patterns with our intelligent personal finance assistant. Make
              informed decisions with real-time insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started Free
              </a>
              <a
                href="/login"
                className="px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold text-lg text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-40 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Core Features for Financial Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to track, analyze, and understand your
              financial data in one comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Transaction Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Effortlessly log and categorize your income and expenses. Keep
                track of every transaction with smart categorization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border border-green-100">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Visual Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Beautiful charts and graphs that help you understand your
                spending patterns and financial trends at a glance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-300 border border-purple-100">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Budget Goals
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Set financial goals and track your progress. Stay motivated with
                clear milestones and achievement tracking.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300 border border-orange-100">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Trend Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Identify spending trends and patterns over time. Make
                data-driven decisions about your financial future.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-all duration-300 border border-teal-100">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Smart Reports
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Generate detailed financial reports with insights and
                recommendations tailored to your spending habits.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Secure & Private
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your financial data is protected with bank-level security. We
                prioritize your privacy and data protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of users who have already taken control of their
            finances. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Free Trial
            </a>
            <a
              href="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Already have an account?
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">$2M+</div>
              <div className="text-gray-600">Money Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                50K+
              </div>
              <div className="text-gray-600">Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
