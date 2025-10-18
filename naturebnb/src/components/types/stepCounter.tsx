import React from "react"
import "../sass/setup.scss"

interface StepCounterProps {
	currentStep: number
	totalSteps?: number
}

const StepCounter: React.FC<StepCounterProps> = ({
	currentStep,
	totalSteps = 5,
}) => {
	return (
		<div className="step-counter">
			{Array.from({ length: totalSteps }).map((_, i) => (
				<React.Fragment key={i}>
					<div className={`step ${i < currentStep ? "active" : ""}`}>
						{i + 1}
					</div>
					{i < totalSteps - 1 && <div className="line" />}
				</React.Fragment>
			))}
		</div>
	)
}

export default StepCounter
