// import { doc } from "firebase/firestore"
import { motion, AnimatePresence } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import "../sass/verification.scss"
import closeLogo from "../../assets/icons/close.png"

type VerificationProps = {
	open: boolean
	email: string
	expectedCode: string
	onVerified: () => void
	onClose: () => void
	onResend?: () => Promise<void>
}

// Controlled verification modal. Parent controls open state and provides the code to validate.
function Verification({
	open,
	email,
	expectedCode,
	onVerified,
	onClose,
	onResend,
}: VerificationProps) {
	const [values, setValues] = useState<string[]>(["", "", "", "", "", ""])
	const inputsRef = useRef<Array<HTMLInputElement | null>>([])
	const [resendDisabled, setResendDisabled] = useState(false)
	const [resendCountdown, setResendCountdown] = useState(0)

	useEffect(() => {
		if (open) {
			setValues(["", "", "", "", "", ""])
			// focus first input when opened
			setTimeout(() => inputsRef.current[0]?.focus(), 50)
		}
	}, [open])

	const updateAt = (index: number, v: string) => {
		if (!/^[0-9]?$/.test(v)) return
		const next = [...values]
		next[index] = v
		setValues(next)
		if (v !== "" && index < inputsRef.current.length - 1) {
			inputsRef.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		i: number
	) => {
		if (e.key === "Backspace" && values[i] === "" && i > 0) {
			inputsRef.current[i - 1]?.focus()
		}
	}

	const submit = () => {
		const code = values.join("")
		if (code.length < 6) {
			alert("Please enter the full 6-digit code.")
			return
		}
		if (code === expectedCode) {
			onVerified()
		} else {
			alert("Incorrect code. Please try again.")
		}
	}

	const startResendCooldown = () => {
		setResendDisabled(true)
		setResendCountdown(30)
		const t = setInterval(() => {
			setResendCountdown((s) => {
				if (s <= 1) {
					clearInterval(t)
					setResendDisabled(false)
					return 0
				}
				return s - 1
			})
		}, 1000)
	}

	const handleResendClick = async () => {
		if (!onResend) return
		try {
			await onResend()
			startResendCooldown()
			alert("Verification code resent.")
		} catch (err) {
			console.error("Resend failed:", err)
			alert("Could not resend code. Try again later.")
		}
	}

	if (!open) return null

	return (
		<AnimatePresence>
			<motion.div className="verification-overlay">
				<motion.div className="close">
					<motion.img src={closeLogo} onClick={onClose}></motion.img>
				</motion.div>
				<motion.div
					className="verification-modal"
					onClick={(e) => e.stopPropagation()}
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 8 }}
				>
					<div className="titleBox">
						<span className="subtitle">Enter Verification Code</span>
						<span className="email">We sent code to {email}</span>
						<span className="title">
							Please enter the 6-digit verification code and continue
						</span>
					</div>
					<div className="formbox">
						{values.map((v, i) => (
							<input
								key={i}
								ref={(el) => {
									inputsRef.current[i] = el
								}}
								className="inputBox"
								inputMode="numeric"
								pattern="[0-9]*"
								maxLength={1}
								value={v}
								onChange={(e) =>
									updateAt(i, e.target.value.replace(/[^0-9]/g, ""))
								}
								onKeyDown={(e) => handleKeyDown(e, i)}
							/>
						))}
					</div>
					<div className="actions">
						<motion.div>
							<button
								className="linkish"
								disabled={resendDisabled}
								onClick={handleResendClick}
							>
								{resendDisabled
									? `Resend (${resendCountdown}s)`
									: "Resend code"}
							</button>
						</motion.div>
						<motion.div>
							<button className="verifyBtn" onClick={submit}>
								Submit
							</button>
							<button className="linkish" onClick={onClose}>
								Cancel
							</button>
						</motion.div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}

export default Verification
