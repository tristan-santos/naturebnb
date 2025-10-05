import "./sass/App.scss"
import logo from "../assets/logoPlain.png"
import { Link } from "react-router-dom"
import "./sass/App.scss"

function navbar() {
	return (
		<nav className="navbar">
			<div className="navbar__logo">
				<img src={logo} alt="NatureBnB Logo" />
				<h1>NatureBnB</h1>
			</div>

			<ul className="navbar__links">
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/login" className="btn">
						Login
					</Link>
				</li>
				<li>
					<Link to="/signup" className="btn">
						Login
					</Link>
				</li>
			</ul>
		</nav>
	)
}

export default navbar
