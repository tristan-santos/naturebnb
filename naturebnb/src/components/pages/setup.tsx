import { useNavigate } from "react-router-dom"
import "../sass/becomeHost.scss"

export default function Setup() {
	const navigate = useNavigate()
	return (
		<div className="center-box">
			<h2>Complete your setup</h2>
			<p>
				Thanks for verifying — finish a few details to complete your host
				profile.
			</p>
			<button className="primary" onClick={() => navigate("/")}>
				Go home
			</button>
		</div>
	)
}
