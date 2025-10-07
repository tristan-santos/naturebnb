import "../sass/category.scss"

function Category() {
	return (
		<div className="categoryBox">
			<div className="box active" onClick={toggleActive}>
				<div className="Homes">Homes</div>
			</div>
			<div className="box" onClick={toggleActive}>
				<div className="Experience">Experience</div>
			</div>
			<div className="box" onClick={toggleActive}>
				<div className="Services">Services</div>
			</div>
		</div>
	)
}

function toggleActive(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
	const boxes = document.querySelectorAll(".box")
	boxes.forEach((box) => box.classList.remove("active"))
	const target = event.currentTarget
	target.classList.add("active")
}

export default Category
