import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../sass/becomeHost.scss"
import { AnimatePresence, motion } from "framer-motion"
import Verification from "../types/verification"

import googleLogo from "../../assets/icons/google (1).png"
import welcomLogo from "../../assets/Tablet login-rafiki.svg"
import signupLogo from "../../assets/Sign up-rafiki.svg"
import hideEye from "../../assets/icons/hide.png"
import openEye from "../../assets/icons/view.png"

// Firebase auth helpers
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	sendPasswordResetEmail,
	setPersistence,
	browserLocalPersistence,
	browserSessionPersistence,
} from "firebase/auth"
import { db } from "../types/firebaseConfig"
import {
	collection,
	addDoc,
	serverTimestamp,
	deleteDoc,
	doc,
	setDoc,
	getDocs,
	getDoc,
	query,
	where,
} from "firebase/firestore"
import { useAuth } from "../context/AuthContext"

export default function BecomeHost() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [remember, setRemember] = useState(true)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [mode, setMode] = useState<"login" | "signup">("login")
	const [verificationOpen, setVerificationOpen] = useState(false)
	const [verificationCode, setVerificationCode] = useState("")
	const [pendingDocId, setPendingDocId] = useState<string | null>(null)
	// password visibility states for login, signup password, signup confirm
	const [viewLogin, setViewLogin] = useState(false)
	const [viewSignupPass, setViewSignupPass] = useState(false)
	const [viewSignupConfirm, setViewSignupConfirm] = useState(false)

	const navigate = useNavigate()
	const auth = getAuth()
	const { setUser } = useAuth()

	// Helper: store user record (object) in localStorage under 'user'
	function saveUserToLocal(userObj: Record<string, unknown> | null) {
		if (!userObj) return
		try {
			localStorage.setItem("user", JSON.stringify(userObj))
			setUser(userObj)
		} catch (e) {
			console.warn("Failed to save user to localStorage", e)
		}
	}

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			scale: 1,
			transition: { staggerChildren: 0.09, when: "beforeChildren" },
		},
	}

	// Simple UUIDv4 generator (no external deps)
	function uuidv4() {
		return "xxxxxxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0
			const v = c === "x" ? r : (r & 0x3) | 0x8
			return v.toString(16)
		})
	}

	const itemVariants = {
		hidden: { opacity: 0, y: -8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	}

	// Map Firebase auth error codes to friendly user messages
	function firebaseAuthMessage(err: unknown): string {
		if (!err) return "An unknown error occurred"
		const anyErr = err as { code?: string; message?: string }
		const code: string | undefined = anyErr?.code
		const msg: string | undefined = anyErr?.message

		switch (code) {
			case "auth/operation-not-allowed":
				return "This sign-in method is disabled in your Firebase project. Open the Firebase Console → Authentication → Sign-in method and enable the provider (Email/Password or Google)."
			case "auth/email-already-in-use":
				return "The email address is already in use. Try signing in or reset the password."
			case "auth/invalid-email":
				return "The email address is invalid. Please check and try again."
			case "auth/weak-password":
				return "The password is too weak. Use at least 6 characters."
			case "auth/wrong-password":
				return "Incorrect password. If you forgot it, use 'Forgot password'."
			case "auth/user-not-found":
				return "No account exists with that email. Please sign up first."
			case "auth/invalid-credential":
				return "The provided credential is invalid or has expired. Try signing in again. If this was a social sign-in, re-authenticate and try again."
			default:
				return msg || String(err)
		}
	}

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			await setPersistence(
				auth,
				remember ? browserLocalPersistence : browserSessionPersistence
			)
			// First check Firestore users collection for a matching email and (optionally) stored password
			try {
				const q = query(collection(db, "users"), where("email", "==", email))
				const snap = await getDocs(q)
				if (snap.empty) {
					setError("No account exists with that email. Please sign up first.")
					setLoading(false)
					return
				}
				// If your users documents store a plaintext `password` field (insecure), validate it here
				const docData = snap.docs[0].data() as Record<string, unknown>
				const storedPass =
					typeof docData.password === "string" ? docData.password : undefined
				if (storedPass !== undefined) {
					if (storedPass !== password) {
						setError("Incorrect password. Please try again.")
						setLoading(false)
						return
					}
					// password matched the stored value; proceed to sign in with Firebase Auth
				}
			} catch (dbCheckErr) {
				console.warn(
					"Error checking users collection before sign-in:",
					dbCheckErr
				)
				// proceed with auth attempt if DB check fails
			}

			const cred = await signInWithEmailAndPassword(auth, email, password)
			console.log("Signed in:", cred.user)
			// fetch user profile from Firestore (if exists) and save locally
			try {
				const ud = await getDoc(doc(db, "users", cred.user.uid))
				if (ud.exists()) {
					saveUserToLocal(ud.data())
				}
			} catch (e) {
				console.warn("Failed to fetch user profile after sign-in", e)
			}
			navigate("/")
		} catch (err: unknown) {
			const a = err as { code?: string; message?: string }
			console.error("Login error:", a)
			setError(
				(a?.code ? `${a.code}: ` : "") +
					(firebaseAuthMessage(err) || a?.message || "Failed to sign in")
			)
		} finally {
			setLoading(false)
		}
	}

	async function handleGoogle() {
		setError(null)
		setLoading(true)
		const provider = new GoogleAuthProvider()
		try {
			await setPersistence(
				auth,
				remember ? browserLocalPersistence : browserSessionPersistence
			)
			const result = await signInWithPopup(auth, provider)
			const userEmail = result.user.email
			// Check if user already exists in Firestore
			const userQuery = query(
				collection(db, "users"),
				where("email", "==", userEmail)
			)
			const userSnap = await getDocs(userQuery)
			if (!userEmail || !result.user.uid) {
				setError("Google account did not return a valid email or uid.")
				setLoading(false)
				return
			}
			if (!userSnap.empty) {
				setError(
					"An account with this email already exists. Please login or use a different email."
				)
				setLoading(false)
				return
			}
			console.log("Google sign-in (initiated):", result.user)
			// Start verification flow for Google sign-ins: generate code and create pendingUsers record
			const code = Math.floor(100000 + Math.random() * 900000).toString()
			setVerificationCode(code)
			const userUuid = uuidv4()
			try {
				const docRef = await addDoc(collection(db, "pendingUsers"), {
					uuid: userUuid,
					uid: result.user.uid,
					email: userEmail,
					provider: "google",
					verificationCode: code,
					createdAt: serverTimestamp(),
				})
				console.log("Pending Google user saved:", docRef.id)
				setPendingDocId(docRef.id)
			} catch (dbErr) {
				console.error("Failed to save pending Google user:", dbErr)
				setPendingDocId(null)
			}
			// open verification modal (user is signed in via Google but final profile creation is gated by verification)
			setVerificationOpen(true)
		} catch (err: unknown) {
			const a = err as { code?: string; message?: string }
			console.error("Google sign-in error:", a)
			setError(
				(a?.code ? `${a.code}: ` : "") +
					(firebaseAuthMessage(err) || a?.message || "Google sign in failed")
			)
		} finally {
			setLoading(false)
		}
	}

	async function handleSignup(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		if (password !== confirmPassword) {
			setError("Passwords do not match")
			return
		}
		setLoading(true)
		try {
			await setPersistence(
				auth,
				remember ? browserLocalPersistence : browserSessionPersistence
			)
			// Check if user already exists in Firestore
			const userQuery = query(
				collection(db, "users"),
				where("email", "==", email)
			)
			const userSnap = await getDocs(userQuery)
			if (userSnap && !userSnap.empty) {
				setError(
					"An account with this email already exists. Please login or use a different email."
				)
				setLoading(false)
				return
			}
			// generate verification code and store a minimal pending user record (do NOT store passwords)
			const code = Math.floor(100000 + Math.random() * 900000).toString()
			setVerificationCode(code)

			// generate uuid for the pending user and store password temporarily (client-side only)
			const userUuid = uuidv4()
			try {
				const docRef = await addDoc(collection(db, "pendingUsers"), {
					uuid: userUuid,
					email,
					password, // stored temporarily until verification creates the real auth user
					verificationCode: code,
					createdAt: serverTimestamp(),
					// keep any non-sensitive metadata here
				})
				console.log("Pending user saved:", docRef.id)
				setPendingDocId(docRef.id)
			} catch (dbErr) {
				console.error("Failed to save pending user:", dbErr)
				setPendingDocId(null)
			}

			// open verification modal (password remains in component state until verified)
			setVerificationOpen(true)
		} catch (err: unknown) {
			console.error("Signup error:", err)
			setError(firebaseAuthMessage(err) || "Signup failed")
		} finally {
			setLoading(false)
		}
	}

	async function handleForgot() {
		setError(null)
		if (!email) {
			setError("Please enter your email to reset password")
			return
		}
		try {
			await sendPasswordResetEmail(auth, email)
			setError("Password reset email sent. Check your inbox.")
		} catch (err: unknown) {
			console.error("Password reset error:", err)
			setError(firebaseAuthMessage(err) || "Could not send reset email")
		}
	}

	async function handleResend() {
		if (!pendingDocId) throw new Error("No pending doc to resend for")
		const newCode = Math.floor(100000 + Math.random() * 900000).toString()
		setVerificationCode(newCode)
		try {
			await setDoc(
				doc(db, "pendingUsers", pendingDocId),
				{
					verificationCode: newCode,
					updatedAt: serverTimestamp(),
				},
				{ merge: true }
			)
			console.log("Resent code and updated pending doc")
		} catch (err) {
			console.error("Failed to resend code:", err)
			throw err
		}
	}

	function handleVerified() {
		// When verification succeeds: create the Auth user, persist a users/{uid} document, remove pendingUsers entry, then redirect to user info
		return (async () => {
			setLoading(true)
			setError(null)
			try {
				let uid: string
				if (auth.currentUser) {
					// User is already signed in (for example via Google). Use their uid and create profile doc.
					uid = auth.currentUser.uid
					await setDoc(
						doc(db, "users", uid),
						{
							uid,
							email: auth.currentUser.email,
							type: "Host",
							createdAt: serverTimestamp(),
						},
						{ merge: true }
					)
				} else {
					// create auth user for email/password flow
					const cred = await createUserWithEmailAndPassword(
						auth,
						email,
						password
					)
					uid = cred.user.uid
					// write user profile document (do not store password)
					await setDoc(doc(db, "users", uid), {
						uid,
						email,
						type: "Host",
						createdAt: serverTimestamp(),
						// add more profile fields here as needed
					})
				}

				// delete pendingUsers doc if exists
				if (pendingDocId) {
					try {
						await deleteDoc(doc(db, "pendingUsers", pendingDocId))
						console.log("Removed pendingUsers doc", pendingDocId)
					} catch (delErr) {
						console.warn("Failed to remove pendingUsers doc:", delErr)
					}
				}

				setVerificationOpen(false)
				// fetch created/merged user doc and save to localStorage
				try {
					const ud = await getDoc(doc(db, "users", uid))
					if (ud.exists()) saveUserToLocal(ud.data())
				} catch (e) {
					console.warn("Failed to fetch user profile after verification", e)
				}
				navigate("/setup")
			} catch (err: unknown) {
				console.error("Error on finalizing verification:", err)
				setError(firebaseAuthMessage(err) || "Could not complete signup")
			} finally {
				setLoading(false)
			}
		})()
	}

	// removed DOM-based toggling; using React state to control input type

	return (
		<motion.div key={mode} className="become-host-page">
			<motion.div className="center-box" aria-label="Become a host container">
				<AnimatePresence>
					{mode === "login" ? (
						<>
							<motion.div
								className="child-box left form-box"
								initial="hidden"
								animate="show"
								variants={containerVariants}
							>
								<motion.h3 variants={itemVariants}>Welcome back</motion.h3>
								<motion.p variants={itemVariants} className="muted">
									Log in to manage listings and bookings
								</motion.p>
								<motion.form
									variants={containerVariants}
									className="login-form"
									onSubmit={handleLogin}
								>
									<motion.label variants={itemVariants}>
										<motion.span variants={itemVariants} className="label-text">
											Email
										</motion.span>
										<motion.input
											variants={itemVariants}
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="you@example.com"
											required
										/>
									</motion.label>
									<motion.label variants={itemVariants}>
										<motion.span variants={itemVariants} className="label-text">
											Password
										</motion.span>
										<motion.div className="inputBox">
											<motion.input
												variants={itemVariants}
												type={viewLogin ? "text" : "password"}
												className="pswrdLog"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												placeholder="Your password"
												required
											/>
											<motion.img
												src={viewLogin ? hideEye : openEye}
												onClick={() => setViewLogin((s) => !s)}
											/>
										</motion.div>
									</motion.label>
									<motion.div variants={itemVariants} className="row between">
										<motion.label variants={itemVariants} className="remember">
											<motion.input
												variants={itemVariants}
												type="checkbox"
												checked={remember}
												onChange={(e) => setRemember(e.target.checked)}
											/>
											<motion.span variants={itemVariants}>
												Remember me
											</motion.span>
										</motion.label>
										<motion.button
											variants={itemVariants}
											type="button"
											className="linkish"
											onClick={handleForgot}
										>
											Forgot password?
										</motion.button>
									</motion.div>
									{error && <div className="error">{error}</div>}
									<motion.button
										variants={itemVariants}
										className="primary"
										type="submit"
										disabled={loading}
									>
										{loading ? "Signing in..." : "Sign in"}
									</motion.button>
									<motion.div variants={itemVariants} className="or">
										or
									</motion.div>
									<motion.div
										variants={containerVariants}
										className="continueGoogle"
									>
										<motion.img
											variants={itemVariants}
											src={googleLogo}
											alt="Google logo"
										/>
										<motion.button
											variants={itemVariants}
											type="button"
											className="google"
											onClick={handleGoogle}
											disabled={loading}
										>
											Continue with Google
										</motion.button>
									</motion.div>
									<motion.div variants={itemVariants} className="signup-note">
										<motion.span variants={itemVariants}>
											Doesn't have an account yet?
										</motion.span>
										<motion.button
											variants={itemVariants}
											type="button"
											className="signup-link linkish"
											onClick={() => setMode("signup")}
										>
											Signup
										</motion.button>
									</motion.div>
								</motion.form>
							</motion.div>

							<motion.div
								variants={containerVariants}
								initial="hidden"
								animate="show"
								className="child-box right welcome-box"
							>
								<motion.div variants={itemVariants} className="welcome-text">
									<motion.h2 variants={itemVariants}>
										Welcome to NatureBnB
									</motion.h2>
									<motion.p variants={itemVariants} className="muted">
										We're glad you're here — Ready to host your space?
									</motion.p>
								</motion.div>
								<motion.div variants={itemVariants} className="welcome-media">
									<motion.img
										variants={itemVariants}
										src={welcomLogo}
										alt="Welcome"
										className="right-img"
									/>
								</motion.div>
							</motion.div>
						</>
					) : (
						<>
							<motion.div
								variants={containerVariants}
								initial="hidden"
								animate="show"
								className="child-box left welcome-box"
							>
								<motion.div variants={itemVariants} className="welcome-text">
									<motion.h2 variants={itemVariants}>
										Thanks for joining
									</motion.h2>
									<motion.p variants={itemVariants} className="muted">
										You're a step away from discovering and hosting unique
										nature stays.
									</motion.p>
								</motion.div>
								<motion.div variants={itemVariants} className="welcome-media">
									<motion.img
										variants={itemVariants}
										src={signupLogo}
										alt="Signup"
										className="right-img"
									/>
								</motion.div>
							</motion.div>

							<motion.div
								className="child-box right form-box"
								initial="hidden"
								animate="show"
								variants={containerVariants}
							>
								<motion.h3 variants={itemVariants}>
									Create your account
								</motion.h3>
								<motion.p variants={itemVariants} className="muted">
									Sign up to host or book unique nature stays
								</motion.p>
								<motion.form
									variants={containerVariants}
									className="login-form"
									onSubmit={handleSignup}
								>
									<motion.label variants={itemVariants}>
										<motion.span variants={itemVariants} className="label-text">
											Email
										</motion.span>
										<motion.input
											variants={itemVariants}
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="you@example.com"
											required
										/>
									</motion.label>
									<motion.label variants={itemVariants}>
										<motion.span variants={itemVariants} className="label-text">
											Password
										</motion.span>
										<motion.div className="inputBox">
											<motion.input
												variants={itemVariants}
												type={viewSignupPass ? "text" : "password"}
												className="passSign"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												placeholder="Create a password"
												required
											/>
											<motion.img
												src={viewSignupPass ? hideEye : openEye}
												onClick={() => setViewSignupPass((s) => !s)}
											/>
										</motion.div>
									</motion.label>
									<motion.label variants={itemVariants}>
										<motion.span variants={itemVariants} className="label-text">
											Confirm password
										</motion.span>
										<motion.div className="inputBox">
											<motion.input
												variants={itemVariants}
												type={viewSignupConfirm ? "text" : "password"}
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												placeholder="Confirm password"
												required
											/>
											<motion.img
												src={viewSignupConfirm ? hideEye : openEye}
												onClick={() => setViewSignupConfirm((s) => !s)}
											/>
										</motion.div>
									</motion.label>
									{error && <div className="error">{error}</div>}
									<motion.button
										variants={itemVariants}
										className="primary"
										type="submit"
										disabled={loading}
									>
										{loading ? "Creating..." : "Create account"}
									</motion.button>
									<motion.div variants={itemVariants} className="or">
										or
									</motion.div>
									<motion.div
										variants={containerVariants}
										className="continueGoogle"
									>
										<motion.img
											variants={itemVariants}
											src={googleLogo}
											alt="Google logo"
										/>
										<motion.button
											variants={itemVariants}
											type="button"
											className="google"
											onClick={handleGoogle}
											disabled={loading}
										>
											Continue with Google
										</motion.button>
									</motion.div>
									<motion.div variants={itemVariants} className="signup-note">
										<motion.span variants={itemVariants}>
											Already have an account?
										</motion.span>
										<motion.button
											variants={itemVariants}
											type="button"
											className="signup-link linkish"
											onClick={() => setMode("login")}
										>
											Login
										</motion.button>
									</motion.div>
									<Verification
										open={verificationOpen}
										email={email}
										expectedCode={verificationCode}
										onVerified={handleVerified}
										onClose={() => setVerificationOpen(false)}
										onResend={handleResend}
									/>
								</motion.form>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</motion.div>
		</motion.div>
	)
}
