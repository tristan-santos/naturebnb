import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../sass/becomeHost.scss"
import "../sass/setup.scss"
import termsAndConditions from "../types/terms"
import check from "../../assets/icons/checked.png"
import close from "../../assets/icons/cancel.png"

// interface users {
// 	uid: string
// 	email: string
// 	password: string
// 	role: string
// 	name: {
// 		firstname: string
// 		middlename: string
// 		lastname: string
// 	}
// 	gender: string

// 	phoneNumber: {
// 		country: string
// 		number: string
// 	}
// 	dateOfBirth: {
// 		year: number
// 		month: number
// 		day: number
// 	}
// 	address: {
// 		province: {
// 			province: string
// 			city: string
// 			street: string
// 			addressLine: string
// 			zipCode: string
// 		}
// 		createdAt: Date
// 		lastLoginAt: Date
// 	}
//  paypal: {
// 		email: string
// 		nameOnCard: string
// 		cardNumber: string
// 		expirationDate: string
// 		cvv: string
// 	}
// }

// function populateUser(userinfo: users) {
// 	const userObj: users = { ...userinfo }
// }

export default function Setup() {
	const navigate = useNavigate()
	const location = useLocation()
	const userInfo = location.state
	// populateUser(userInfo)

	useEffect(() => {
		if (!userInfo) {
			console.warn("No user information provided. Redirecting to login.")
			navigate("/", { replace: true })
		}
	}, [userInfo, navigate])
	const cards = document.querySelectorAll(".card")
	const indx: number = 0
	return (
		<>
			<div className="container">
				{userInfo && (
					<div className="box">
						<div className="card one active">
							<div className="title">
								<span>
									Before you can start hosting, please read and agree to our
									<span> Terms & Conditions and Privacy Policy.</span>
								</span>
							</div>
							<div className="terms">
								<textarea
									name="terms"
									id="terms"
									readOnly
									value={termsAndConditions}
								/>
							</div>

							<div className="button">
								<div
									className="agree"
									onClick={() => {
										cards[indx].classList.remove("active")
										cards[indx + 1].classList.add("active")
										cards[indx + 2].classList.add("next")
									}}
								>
									<img src={check} alt="check" />
									<button className="Agree">Agree</button>
								</div>
								<div className="disagree">
									<img src={close} alt="close" />
									<button className="Disagree">Disagree</button>
								</div>
							</div>
						</div>
						<div className="card two"></div>
						<div className="card three"></div>
						<div className="card four"></div>
						<div className="card five"></div>
					</div>
				)}
			</div>
		</>
	)
}
