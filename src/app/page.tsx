export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-3">
        Personal Finance Assistant
      </h1>
      <p className="text-gray-600 mb-6">
        Track income, expenses, and visualize your spending.
      </p>
      <div className="space-x-4">
        <a
          href="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Get Started
        </a>
        <a href="/login" className="px-4 py-2 border rounded">
          Login
        </a>
      </div>
    </div>
  );
}
