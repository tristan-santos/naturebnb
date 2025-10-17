import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import logo from "../../assets/logoNobgWhite.png"
import "../sass/App.scss"

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
		transition: { duration: 0.35 },
	},
}

function landingBar({ loc }) {
	return (
		<motion.nav
			className="navbar"
			initial="hidden"
			animate="show"
			variants={containerVariants}
		>
			<motion.div className="navbar__logo" variants={itemVariants}>
				<img src={logo} alt="NatureBnB Logo" />
				<Link to="/" className="textLogo">
					NatureBnB
				</Link>
			</motion.div>

			<motion.ul className="navbar__links" variants={containerVariants}>
				<motion.li
					variants={itemVariants}
					{...(loc === "/" ? { className: "active" } : {})}
				>
					<Link to="/">Home</Link>
				</motion.li>
				<motion.li variants={itemVariants}>
					<Link
						to="/becomeHost"
						{...(loc === "/becomeHost" ? { className: "active" } : {})}
					>
						Become a Host
					</Link>
				</motion.li>
				<motion.li variants={itemVariants}>
					<Link to="/login" className="btn">
						Login
					</Link>
				</motion.li>
			</motion.ul>
		</motion.nav>
	)
}

export default landingBar
