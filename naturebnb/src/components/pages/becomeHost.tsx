import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../sass/becomeHost.scss"
import { AnimatePresence, motion } from "framer-motion"

import googleLogo from "../../assets/icons/google (1).png"
import welcomLogo from "../../assets/Tablet login-rafiki.svg"
import signupLogo from "../../assets/Sign up-rafiki.svg"
import hideEye from "../../assets/icons/hide.png"
import openEye from "../../assets/icons/view.png"
import LandingBar from "../../components/types/landingBar"

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
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "../types/firebaseConfig"

// Define a custom error type
interface FirebaseError {
	code?: string
	message?: string
}

export default function BecomeHost() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [remember, setRemember] = useState(true)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [mode, setMode] = useState<"login" | "signup">("login")
	const [viewLogin, setViewLogin] = useState(false)
	const [viewSignupPass, setViewSignupPass] = useState(false)
	const [viewSignupConfirm, setViewSignupConfirm] = useState(false)

	const navigate = useNavigate()
	const auth = getAuth()

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
			const cred = await signInWithEmailAndPassword(auth, email, password)
			const userDocRef = doc(db, "users", cred.user.uid)
			const userDoc = await getDoc(userDocRef)
			if (userDoc.exists()) {
				const userData = userDoc.data()
				const userId = userDoc.id
				navigate("/setup", { state: { id: userId, user: userData } })
				location.pathname = "/setup"
			} else {
				throw new Error("User data not found in Firestore.")
			}
		} catch (err: unknown) {
			const error = err as FirebaseError
			setError(
				(error?.code ? `${error.code}: ` : "") +
					(firebaseAuthMessage(error) || error?.message || "Failed to sign in")
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
			const userDocRef = doc(db, "users", result.user.uid)
			const userDoc = await getDoc(userDocRef)
			if (userDoc.exists()) {
				const userData = userDoc.data()
				navigate("/setup", { state: userData })
			} else {
				throw new Error("User data not found in Firestore.")
			}
		} catch (err: unknown) {
			const error = err as FirebaseError
			setError(
				(error?.code ? `${error.code}: ` : "") +
					(firebaseAuthMessage(error) || error?.message || "Failed to sign in")
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
			const cred = await createUserWithEmailAndPassword(auth, email, password)
			const userInfo = {
				user: {
					uid: cred.user.uid,
					email,
					password,
					role: "Host",
					initialCreation: new Date().toISOString(),
				},
			}
			await setDoc(doc(db, "users", cred.user.uid), userInfo)
			navigate("/setup", { state: userInfo })
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

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			scale: 1,
			transition: { staggerChildren: 0.09, when: "beforeChildren" },
		},
	}
	const itemVariants = {
		hidden: { opacity: 0, y: -8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	}

	return (
		<>
			<LandingBar />
			<motion.div
				key={mode}
				className="become-host-page"
				variants={containerVariants}
				initial="hidden"
				animate="show"
			>
				<motion.div
					className="center-box"
					aria-label="Become a host container"
					variants={containerVariants}
				>
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
									<motion.p className="muted" variants={itemVariants}>
										Log in to manage listings and bookings
									</motion.p>
									<motion.form
										className="login-form"
										onSubmit={handleLogin}
										variants={containerVariants}
									>
										<motion.label variants={itemVariants}>
											<motion.span className="label-text">Email</motion.span>
											<motion.input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="you@example.com"
												required
											/>
										</motion.label>
										<motion.label variants={itemVariants}>
											<motion.span className="label-text">Password</motion.span>
											<motion.div className="inputBox">
												<motion.input
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
										<motion.div className="row between" variants={itemVariants}>
											<motion.label className="remember">
												<motion.input
													type="checkbox"
													checked={remember}
													onChange={(e) => setRemember(e.target.checked)}
												/>
												<motion.span>Remember me</motion.span>
											</motion.label>
											<motion.button
												type="button"
												className="linkish"
												onClick={handleForgot}
											>
												Forgot password?
											</motion.button>
										</motion.div>
										{error && <div className="error">{error}</div>}
										<motion.button
											className="primary"
											type="submit"
											disabled={loading}
											variants={itemVariants}
										>
											{loading ? "Signing in..." : "Sign in"}
										</motion.button>
										<motion.div className="or" variants={itemVariants}>
											or
										</motion.div>
										<motion.div
											className="continueGoogle"
											variants={containerVariants}
										>
											<motion.img src={googleLogo} alt="Google logo" />
											<motion.button
												type="button"
												className="google"
												onClick={handleGoogle}
												disabled={loading}
											>
												Continue with Google
											</motion.button>
										</motion.div>
										<motion.div className="signup-note" variants={itemVariants}>
											<motion.span>Doesn't have an account yet?</motion.span>
											<motion.button
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
									initial="hidden"
									animate="show"
									className="child-box right welcome-box"
									variants={containerVariants}
								>
									<motion.div
										className="welcome-text"
										variants={containerVariants}
									>
										<motion.h2 variants={itemVariants}>
											Welcome to NatureBnB
										</motion.h2>
										<motion.p className="muted" variants={itemVariants}>
											We're glad you're here — Ready to host your space?
										</motion.p>
									</motion.div>
									<motion.div className="welcome-media" variants={itemVariants}>
										<motion.img
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
									initial="hidden"
									animate="show"
									className="child-box left welcome-box"
									variants={containerVariants}
								>
									<motion.div
										className="welcome-text"
										variants={containerVariants}
									>
										<motion.h2 variants={itemVariants}>
											Thanks for joining
										</motion.h2>
										<motion.p className="muted" variants={itemVariants}>
											You're a step away from discovering and hosting unique
											nature stays.
										</motion.p>
									</motion.div>
									<motion.div className="welcome-media" variants={itemVariants}>
										<motion.img
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
									<motion.p className="muted" variants={itemVariants}>
										Sign up to host or book unique nature stays
									</motion.p>
									<motion.form
										className="login-form"
										onSubmit={handleSignup}
										variants={containerVariants}
									>
										<motion.label variants={itemVariants}>
											<motion.span className="label-text">Email</motion.span>
											<motion.input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="you@example.com"
												required
											/>
										</motion.label>
										<motion.label variants={itemVariants}>
											<motion.span className="label-text">Password</motion.span>
											<motion.div className="inputBox">
												<motion.input
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
											<motion.span className="label-text">
												Confirm password
											</motion.span>
											<motion.div className="inputBox">
												<motion.input
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
											className="primary"
											type="submit"
											disabled={loading}
											variants={itemVariants}
										>
											{loading ? "Creating..." : "Create account"}
										</motion.button>
										<motion.div className="or" variants={itemVariants}>
											or
										</motion.div>
										<motion.div
											className="continueGoogle"
											variants={containerVariants}
										>
											<motion.img src={googleLogo} alt="Google logo" />
											<motion.button
												type="button"
												className="google"
												onClick={handleGoogle}
												disabled={loading}
											>
												Continue with Google
											</motion.button>
										</motion.div>
										<motion.div className="signup-note" variants={itemVariants}>
											<motion.span>Already have an account?</motion.span>
											<motion.button
												type="button"
												className="signup-link linkish"
												onClick={() => setMode("login")}
											>
												Login
											</motion.button>
										</motion.div>
									</motion.form>
								</motion.div>
							</>
						)}
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</>
	)
}
