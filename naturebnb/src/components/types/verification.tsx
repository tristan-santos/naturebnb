import { motion, AnimatePresence } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import "../sass/verification.scss"
import closeLogo from "../../assets/icons/close.png"
import closeSuccess from "../../assets/icons/closeSuccess.png"

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
	// status: idle | success | error - used to style overlay / inputs
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

	useEffect(() => {
		if (open) {
			setValues(["", "", "", "", "", ""])
			// focus first input when opened
			setTimeout(() => inputsRef.current[0]?.focus(), 50)
			setStatus("idle")
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
			// show success state briefly on overlay before notifying parent
			setStatus("success")
			setTimeout(() => {
				onVerified()
			}, 400)
		} else {
			// show error state (overlay will shake) and reset after a short delay
			setStatus("error")
			setTimeout(() => {
				setStatus("idle")
				setValues(["", "", "", "", "", ""])
				// focus first input again
				setTimeout(() => inputsRef.current[0]?.focus(), 50)
			}, 900)
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
			<motion.div
				className={`verification-overlay  ${
					status === "success" ? "success" : ""
				}`}
				initial={{ opacity: 0, y: 8, x: 0 }}
				animate={
					status === "error"
						? { opacity: 1, y: 0, x: [0, -12, 12, -8, 8, 0] }
						: { opacity: 1, y: 0, x: 0 }
				}
				transition={
					status === "error"
						? { duration: 0.8, ease: "easeInOut" }
						: { duration: 0.25 }
				}
			>
				<div className="close">
					<img
						src={status === "success" ? closeSuccess : closeLogo}
						onClick={onClose}
					/>
				</div>

				<motion.div
					className="verification-modal"
					onClick={(e) => e.stopPropagation()}
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 8 }}
					transition={{ duration: 0.25 }}
				>
					<div className="titleBox">
						<span className="subtitle">Enter Verification Code</span>
						<span className="email">We sent code to {email}</span>
						<span className="title">
							Please enter the 6-digit verification code and continue
						</span>
					</div>

					<div className="formbox">
						{values.map((v, i) => {
							const cls = `inputBox ${status === "error" ? "error" : ""}`
							return (
								<motion.input
									key={i}
									ref={(el) => {
										inputsRef.current[i] = el
									}}
									className={cls}
									inputMode="numeric"
									pattern="[0-9]*"
									maxLength={1}
									value={v}
									whileFocus={{ scale: 1.2, transition: { duration: 0.1 } }}
									onChange={(e) =>
										updateAt(i, e.target.value.replace(/[^0-9]/g, ""))
									}
									onKeyDown={(e) => handleKeyDown(e, i)}
								/>
							)
						})}
					</div>

					<motion.div className="actions">
						<motion.div>
							<motion.button
								className="linkish"
								disabled={resendDisabled}
								whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
								onClick={handleResendClick}
							>
								{resendDisabled
									? `Resend (${resendCountdown}s)`
									: "Resend code"}
							</motion.button>
						</motion.div>

						<motion.div>
							<motion.button
								whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
								className="verifyBtn"
								onClick={submit}
							>
								Submit
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
								className="linkish"
								onClick={onClose}
							>
								Cancel
							</motion.button>
						</motion.div>
					</motion.div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}

export default Verification
