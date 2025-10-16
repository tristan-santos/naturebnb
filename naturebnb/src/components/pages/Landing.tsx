import Card from "../types/card"
import "../sass/landing.scss"
import SearchBar from "../types/searchBar"
import LandingBar from "../../components/types/landingBar"

import Category from "../types/category"

function Landing() {
	return (
		<>
			<LandingBar />
			<div className="landingBox">
				<div className="topBox">
					<div className="categories">
						<Category />
					</div>
					<div className="search">
						<SearchBar />
					</div>
				</div>
				<div className="cardbox">
					<span className="title">Available Houses</span>
					<Card />
				</div>
			</div>
		</>
	)
}

export default Landing
