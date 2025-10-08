import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import "../sass/404.scss"
import image404 from "../../assets/404 Error-rafiki (2).png"

export default function NotFound() {
	const navigate = useNavigate()
	return (
		<motion.div className="center-box404">
			<div className="error404">
				<motion.img src={image404} />
			</div>
			<div className="error404">
				<motion.h1>404 — Page not found</motion.h1>
				<motion.h2>Something gone wrong!</motion.h2>
				<motion.p>The page you were looking for doesn't exist.</motion.p>
				<motion.button className="primary" onClick={() => navigate("/")}>
					Return home
				</motion.button>
			</div>
		</motion.div>
	)
}
