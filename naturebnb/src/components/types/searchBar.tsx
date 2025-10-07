import "../sass/search.scss"
import searchIcon from "../../assets/icons/magnifier.png"

function SearchBar() {
	return (
		<div className="search-bar">
			<div className="searchBox">
				<div className="inputBox">
					<label htmlFor="where">Where</label>
					<input
						type="text"
						className="where"
						id="where"
						placeholder="Search location"
					/>
				</div>
				<div className="inputBox">
					<label htmlFor="checkInDates">Check-in Dates</label>
					<input
						type="text"
						className="checkInDates"
						id="checkInDates"
						placeholder="Select dates"
						maxLength={0}
					/>
				</div>
				<div className="inputBox">
					<label htmlFor="checkOutDates">Check-out Dates</label>
					<input
						type="text"
						className="checkOutDates"
						id="checkOutDates"
						placeholder="Select dates"
						maxLength={0}
					/>
				</div>
				<div className="inputBox">
					<label htmlFor="who">Who</label>
					<input
						type="text"
						className="who"
						id="who"
						placeholder="Add Guests"
						maxLength={0}
					/>
				</div>
				<div className="inputBox">
					<div className="iconBox">
						<img src={searchIcon} alt="searchIcon" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default SearchBar
