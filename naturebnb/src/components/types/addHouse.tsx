// src/components/AddHouse.tsx
import React from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "./firebaseConfig"

const AddHouse: React.FC = () => {
	const handleAddSampleData = async () => {
		const sampleHouse = {
			id: "DOC_001",
			houseId: "H12345",
			hostId: "UID_abc123",
			hostName: "John Doe",
			houseName: "Cozy Beach Cottage",
			description:
				"A peaceful seaside cottage perfect for a relaxing getaway. Enjoy ocean views, a private garden, and cozy interiors.",
			address: "123 Beachfront Road",
			city: "Nasugbu",
			province: "Batangas",
			country: "Philippines",
			latitude: 14.0668,
			longitude: 120.6312,
			pricePerNight: 3500,
			cleaningFee: 500,
			serviceFee: 200,
			currency: "PHP",
			maxGuests: 4,
			minNights: 1,
			maxNights: 7,
			availableDates: ["2025-10-10", "2025-10-11", "2025-10-15", "2025-10-20"],
			bedrooms: 2,
			beds: 3,
			bathrooms: 1,
			houseType: "Cottage",
			amenities: [
				"WiFi",
				"Air Conditioning",
				"Kitchen",
				"Free Parking",
				"Beach Access",
			],
			rules: ["No smoking", "No pets allowed", "Quiet hours after 10 PM"],
			mainImage: "",
			gallery: [],
			rating: 4.8,
			reviewsCount: 26,
			isVerified: true,
			isFeatured: false,
			status: "available",
			createdAt: new Date("2025-10-07T12:00:00Z"),
			updatedAt: new Date("2025-10-07T12:00:00Z"),
		}

		try {
			await addDoc(collection(db, "houses"), sampleHouse)
			alert("✅ Sample house added successfully!")
		} catch (error) {
			console.error("Error adding house:", error)
		}
	}

	return (
		<div style={{ textAlign: "center", margin: "20px" }}>
			<h2>Add Sample House</h2>
			<button onClick={handleAddSampleData}>Add to Firestore</button>
		</div>
	)
}

export default AddHouse
