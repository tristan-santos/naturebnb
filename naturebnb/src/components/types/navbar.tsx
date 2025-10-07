import { Link } from "react-router-dom"

import logo from "../../assets/logoNobgWhite.png"
import "../sass/App.scss"

function navbar() {
	return (
		<nav className="navbar">
			<div className="navbar__logo">
				<img src={logo} alt="NatureBnB Logo" />
				<Link to="/" className="textLogo">
					NatureBnB
				</Link>
			</div>

			<ul className="navbar__links">
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/becomeHost">Become a Host</Link>
				</li>
				<li>
					<Link to="/login" className="btn">
						Login
					</Link>
				</li>
			</ul>
		</nav>
	)
}

export default navbar
