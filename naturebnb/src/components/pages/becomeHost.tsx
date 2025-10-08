import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../sass/becomeHost.scss"
import { motion } from "framer-motion"

import googleLogo from "../../assets/icons/google (1).png"
import welcomLogo from "../../assets/Tablet login-rafiki.svg"
import signupLogo from "../../assets/Sign up-rafiki.svg"

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

function BecomeHost() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [remember, setRemember] = useState(true)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [mode, setMode] = useState<"login" | "signup">("login")

	const navigate = useNavigate()
	const auth = getAuth()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			await setPersistence(
				auth,
				remember ? browserLocalPersistence : browserSessionPersistence
			)
			const cred = await signInWithEmailAndPassword(auth, email, password)
			console.log("Signed in:", cred.user)
			navigate("/")
		} catch (err: unknown) {
			const msg =
				err && typeof err === "object" && "message" in err
					? ((err as { message?: unknown }).message as string)
					: String(err)
			setError(msg || "Failed to sign in")
		} finally {
			setLoading(false)
		}
	}

	const handleGoogle = async () => {
		setError(null)
		setLoading(true)
		const provider = new GoogleAuthProvider()
		try {
			await setPersistence(
				auth,
				remember ? browserLocalPersistence : browserSessionPersistence
			)
			const result = await signInWithPopup(auth, provider)
			console.log("Google sign-in:", result.user)
			navigate("/")
		} catch (err: unknown) {
			const msg =
				err && typeof err === "object" && "message" in err
					? ((err as { message?: unknown }).message as string)
					: String(err)
			setError(msg || "Google sign in failed")
		} finally {
			setLoading(false)
		}
	}

	const handleSignup = async (e: React.FormEvent) => {
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
			const user = await createUserWithEmailAndPassword(auth, email, password)
			console.log("User created:", user.user)
			navigate("/")
		} catch (err: unknown) {
			const msg =
				err && typeof err === "object" && "message" in err
					? ((err as { message?: unknown }).message as string)
					: String(err)
			setError(msg || "Signup failed")
		} finally {
			setLoading(false)
		}
	}

	const handleForgot = async () => {
		setError(null)
		if (!email) {
			setError("Please enter your email to reset password")
			return
		}
		try {
			await sendPasswordResetEmail(auth, email)
			setError("Password reset email sent. Check your inbox.")
		} catch (err: unknown) {
			const msg =
				err && typeof err === "object" && "message" in err
					? ((err as { message?: unknown }).message as string)
					: String(err)
			setError(msg || "Could not send reset email")
		}
	}
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.13,
				when: "beforeChildren",
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: -8 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	}
	return (
		<div className="become-host-page">
			<div className="center-box" aria-label="Become a host container">
				{/* Left panel: login or signup form */}
				<motion.div
					className="child-box left form-box"
					initial="hidden"
					animate="show"
					variants={containerVariants}
				>
					{mode === "login" ? (
						<>
							<motion.h3 variants={itemVariants}>Welcome back</motion.h3>
							<motion.p variants={itemVariants} className="muted">
								Sign in to manage listings and bookings
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
								<motion.label>
									<motion.span className="label-text">Password</motion.span>
									<motion.input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Your password"
										required
									/>
								</motion.label>
								<div className="row between">
									<label className="remember">
										<input
											type="checkbox"
											checked={remember}
											onChange={(e) => setRemember(e.target.checked)}
										/>
										<span>Remember me</span>
									</label>
									<button
										type="button"
										className="linkish"
										onClick={handleForgot}
									>
										Forgot password?
									</button>
								</div>
								{error && <div className="error">{error}</div>}
								<button className="primary" type="submit" disabled={loading}>
									{loading ? "Signing in..." : "Sign in"}
								</button>
								<div className="or">or</div>
								<div className="continueGoogle">
									<img src={googleLogo} alt="Google logo" />
									<button
										type="button"
										className="google"
										onClick={handleGoogle}
										disabled={loading}
									>
										Continue with Google
									</button>
								</div>
								<div className="signup-note">
									<span>Doesn't have an account yet?</span>
									<button
										type="button"
										className="signup-link linkish"
										onClick={() => setMode("signup")}
									>
										Signup
									</button>
								</div>
							</motion.form>
						</>
					) : (
						<>
							<h3>Create your account</h3>
							<p className="muted">
								Sign up to host or book unique nature stays
							</p>
							<form className="login-form" onSubmit={handleSignup}>
								<label>
									<span className="label-text">Email</span>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="you@example.com"
										required
									/>
								</label>
								<label>
									<span className="label-text">Password</span>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Create a password"
										required
									/>
								</label>
								<label>
									<span className="label-text">Confirm password</span>
									<input
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										placeholder="Confirm password"
										required
									/>
								</label>
								{error && <div className="error">{error}</div>}
								<button className="primary" type="submit" disabled={loading}>
									{loading ? "Creating..." : "Create account"}
								</button>
								<div className="or">or</div>
								<div className="continueGoogle">
									<img src={googleLogo} alt="Google logo" />
									<button
										type="button"
										className="google"
										onClick={handleGoogle}
										disabled={loading}
									>
										Continue with Google
									</button>
								</div>
								<div className="signup-note">
									<span>Already have an account?</span>
									<button
										type="button"
										className="signup-link linkish"
										onClick={() => setMode("login")}
									>
										Login
									</button>
								</div>
							</form>
						</>
					)}
				</motion.div>

				{/* Right panel: welcome area (static swap) */}
				<div className="child-box right welcome-box">
					<div className="welcome-text">
						<h2>
							{mode === "login" ? "Welcome to NatureBnB" : "Thanks for joining"}
						</h2>
						<p className="muted">
							{mode === "login"
								? "We're glad you're here — find a cozy nature stay or host your space."
								: "You're a step away from discovering and hosting unique nature stays."}
						</p>
					</div>
					<div className="welcome-media">
						{mode === "login" ? (
							<img src={welcomLogo} alt="Welcome" className="right-img" />
						) : (
							<img src={signupLogo} alt="Signup" className="right-img" />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default BecomeHost;
