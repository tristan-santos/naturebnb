import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import "../sass/becomeHost.scss"
import image404 from "../../assets/404 Error-rafiki (2).png"

export default function NotFound() {
	const navigate = useNavigate()
	return (
		<motion.div className="center-box">
			<motion.h2>404 — Page not found</motion.h2>
			<motion.p>The page you were looking for doesn't exist.</motion.p>
			<motion.img src={image404} />
			<motion.button className="primary" onClick={() => navigate("/")}>
				Return home
			</motion.button>
		</motion.div>
	)
}
