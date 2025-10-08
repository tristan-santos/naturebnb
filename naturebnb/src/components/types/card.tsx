// src/components/Card.tsx
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebaseConfig"
import "../../components/sass/card.scss"
import placeHolder from "../../assets/housePlaceholder.png"

// Define the shape of your house document
interface House {
	id: string
	houseId: string
	hostId: string
	hostName: string
	houseName: string
	description: string
	address: string
	city: string
	province: string
	country: string
	latitude: number
	longitude: number
	pricePerNight: number
	cleaningFee: number
	serviceFee: number
	currency: string
	maxGuests: number
	minNights: number
	maxNights: number
	availableDates: string[]
	bedrooms: number
	beds: number
	bathrooms: number
	houseType: string
	amenities: string[]
	rules: string[]
	mainImage: string
	gallery: string[]
	rating: number
	reviewsCount: number
	isVerified: boolean
	isFeatured: boolean
	status: string
	createdAt: string
	updatedAt: string
}

const Card: React.FC<{ showAll?: boolean }> = ({ showAll = false }) => {
	const [houses, setHouses] = useState<House[]>([])

	useEffect(() => {
		const fetchHouses = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "houses"))
				const houseList: House[] = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as House[]
				// Filter houses by status field unless showAll is true
				const filtered = showAll
					? houseList
					: houseList.filter((h) => h.status === "available")
				setHouses(filtered)
			} catch (error) {
				console.error("Error fetching houses:", error)
			}
		}

		fetchHouses()
	}, [showAll])

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.18, when: "beforeChildren" },
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.46 } },
	}

	return (
		<motion.div
			className="card-container"
			variants={containerVariants}
			initial="hidden"
			animate="show"
		>
			{houses.length === 0 ? (
				<p>No houses Available Yet...</p>
			) : (
				houses.map((house) => (
					<motion.div
						className="card"
						key={house.id}
						variants={itemVariants}
						layout
					>
						<img
							src={house.mainImage || placeHolder}
							alt={house.houseName}
							className="card-image"
						/>
						<div className="card-content">
							<h2 className="card-title">{house.houseName}</h2>
							<p className="card-location">
								{house.city}, {house.country}
							</p>
							<p className="card-description">{house.description}</p>
							<p className="card-price">
								<strong>₱{house.pricePerNight.toLocaleString()}</strong> / night
							</p>
							<p className="card-rating">
								⭐ {house.rating} ({house.reviewsCount} reviews)
							</p>
							<ul className="card-amenities">
								{house.amenities?.slice(0, 3).map((amenity, i) => (
									<li key={i}>{amenity}</li>
								))}
							</ul>
						</div>
					</motion.div>
				))
			)}
		</motion.div>
	)
}

export default Card
