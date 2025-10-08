import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth } from "firebase/auth"
import { db } from "../types/firebaseConfig"
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"

export default function UserInfo() {
	const [name, setName] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()
	const auth = getAuth()

	useEffect(() => {
		const user = auth.currentUser
		if (!user) {
			// if not authenticated, redirect to home/login
			navigate("/")
			return
		}

		// optionally prefill with existing profile
		;(async () => {
			try {
				const snap = await getDoc(doc(db, "users", user.uid))
				if (snap.exists()) {
					const data = snap.data() as Record<string, unknown>
					if (typeof data.displayName === "string") setName(data.displayName)
				}
			} catch (err) {
				console.warn("Could not read user profile:", err)
			}
		})()
	}, [navigate, auth])

	async function handleSave(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		const user = auth.currentUser
		if (!user) {
			setError("Not authenticated")
			setLoading(false)
			return
		}
		try {
			await setDoc(
				doc(db, "users", user.uid),
				{
					displayName: name,
					updatedAt: serverTimestamp(),
				},
				{ merge: true }
			)
			navigate("/")
		} catch (err) {
			console.error(err)
			setError("Could not save profile")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="user-info-page">
			<h2>Complete your profile</h2>
			{error && <div className="error">{error}</div>}
			<form onSubmit={handleSave}>
				<label>
					Full name
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</label>
				<button type="submit" disabled={loading}>
					{loading ? "Saving..." : "Save"}
				</button>
			</form>
		</div>
	)
}
