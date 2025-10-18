import React, { useEffect, useState } from "react"
import "../sass/animatedCheck.scss"

const AnimatedCheck: React.FC = () => {
	const [animate, setAnimate] = useState(false)

	useEffect(() => {
		// Start animation after component mounts
		const timer = setTimeout(() => setAnimate(true), 200)
		return () => clearTimeout(timer)
	}, [])

	return (
		<div className={`check-container ${animate ? "animate" : ""}`}>
			<svg viewBox="0 0 52 52" className="checkmark">
				<circle
					className="checkmark__circle"
					cx="26"
					cy="26"
					r="25"
					fill="none"
				/>
				<path className="checkmark__check" fill="none" d="M14 27l7 7 16-16" />
			</svg>
		</div>
	)
}

export default AnimatedCheck
