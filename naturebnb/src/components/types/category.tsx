import { useState } from "react"
import { motion } from "framer-motion"
import "../sass/category.scss"

const CATEGORIES = ["Homes", "Experience", "Services"]

function Category() {
	const [selected, setSelected] = useState<string>(CATEGORIES[0])

	return (
		<div className="categoryBox">
			{CATEGORIES.map((cat) => {
				const isActive = selected === cat
				return (
					<motion.div
						key={cat}
						className={`box ${isActive ? "active" : ""}`}
						onClick={() => setSelected(cat)}
						layout
						initial={false}
						animate={
							isActive
								? { scale: 1.03, backgroundColor: "#bebebeff" }
								: { scale: 1, backgroundColor: "#ffffffff" }
						}
						transition={{ type: "spring", stiffness: 300, damping: 22 }}
					>
						<div className={cat}>{cat}</div>
					</motion.div>
				)
			})}
		</div>
	)
}

export default Category
