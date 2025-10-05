// In src/utils/listingService.ts
import { v4 as uuidv4 } from "uuid" // Import v4 function

function UUID() {
	const newId = uuidv4()
	console.log(`Assigning new ID: ${newId}`)
	// Use newId when saving to Firestore
	return <div>UUID Component - New ID: {newId}</div>
	// ... db.collection('listings').doc(newId).set({...})
}

export default UUID
