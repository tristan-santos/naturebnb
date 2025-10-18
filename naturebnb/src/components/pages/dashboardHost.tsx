import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function DashboardHost() {
	const location = useLocation()
	const userInfo = location.state
	const navigate = useNavigate()

	useEffect(() => {
		if (!userInfo) {
			console.warn("No user information provided. Redirecting to login.")
			navigate("/", { replace: true })
		} else {
			console.log("User information received:", userInfo)
		}
	}, [userInfo, navigate])

	return <></>
}

export default DashboardHost
