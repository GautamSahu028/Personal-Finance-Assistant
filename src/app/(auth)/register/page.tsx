"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
		if (!res.ok) {
			const data = await res.json();
			setError(data.error || "Registration failed");
			return;
		}
		router.push("/login");
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
				<h1 className="text-xl font-semibold mb-4">Register</h1>
				{error && <p className="text-red-600 text-sm mb-2">{error}</p>}
				<label className="block text-sm mb-1">Name</label>
				<input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
				<label className="block text-sm mb-1">Email</label>
				<input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2 mb-3" required />
				<label className="block text-sm mb-1">Password</label>
				<input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full border rounded px-3 py-2 mb-4" required />
				<button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create account</button>
				<p className="text-sm mt-3 text-gray-600">Have an account? <a className="text-blue-600" href="/login">Login</a></p>
			</form>
		</div>
	);
}


