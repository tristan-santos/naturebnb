import { useEffect } from "react"
import type { ClipboardEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../sass/becomeHost.scss"
import "../sass/setup.scss"
import termsAndConditions from "../types/terms"
import check from "../../assets/icons/checked.png"
import close from "../../assets/icons/multiply.png"

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
		} else {
			console.log("User information received:", userInfo)
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
									<button
										className="Agree"
										onClick={() => {
											cards[indx].classList.remove("active")
											cards[indx + 1].classList.add("active")
											cards[indx + 2].classList.add("next")
										}}
									>
										Agree
									</button>
								</div>
								<div
									className="disagree"
									onClick={() => {
										navigate("/")
									}}
									onMouseEnter={() => {
										console.log("error")
										cards[indx].classList.add("hovered")
									}}
									onMouseLeave={() => {
										cards[indx].classList.remove("hovered")
									}}
								>
									<img src={close} alt="close" />
									<button
										className="Disagree"
										onClick={() => {
											navigate("/")
										}}
										onMouseEnter={() => {
											console.log("error")
											cards[indx].classList.add("hovered")
										}}
										onMouseLeave={() => {
											cards[indx].classList.remove("hovered")
										}}
									>
										Disagree
									</button>
								</div>
							</div>
						</div>
						<div className="card two">
							<div className="title">
								<span>Please fill up the form</span>
							</div>
							<div className="form">
								<div className="name">
									<div className="fname">
										<label htmlFor="fname" className="labelName">
											First Name
										</label>
										<input
											type="text"
											id="fname"
											placeholder="input first name"
										/>
									</div>
									<div className="suffix">
										<label htmlFor="suffix">Suffix:</label>
										<select id="suffix" name="suffix" required>
											<option value="" selected>
												None
											</option>
											<option value="Jr.">Jr.</option>
											<option value="Sr.">Sr.</option>
											<option value="I">I</option>
											<option value="II">II</option>
											<option value="III">III</option>
											<option value="IV">IV</option>
											<option value="V">V</option>
										</select>
									</div>
									<div className="lname">
										<label htmlFor="lname" className="labelName">
											Last Name
										</label>
										<input
											type="text"
											id="lname"
											placeholder="input last name"
										/>
									</div>
									<div className="mname">
										<label htmlFor="mname" className="labelName">
											Middle Name
										</label>
										<input
											type="text"
											id="mname"
											placeholder="input middle name"
										/>
									</div>
								</div>
								<div className="gender">
									<div className="male">
										<label htmlFor="male">Male</label>
										<input type="radio" id="male" name="gender" value="male" />
									</div>
									<div className="female">
										<label htmlFor="female">Female</label>
										<input
											type="radio"
											id="female"
											name="gender"
											value="female"
										/>
									</div>
								</div>
								<div className="phoneNum">
									<div className="countries">
										<select id="country" name="country" required>
											<option value="">-- Select Country --</option>
											<option value="+61">🇦🇺 Australia (+61)</option>
											<option value="+880">🇧🇩 Bangladesh (+880)</option>
											<option value="+55">🇧🇷 Brazil (+55)</option>
											<option value="+86">🇨🇳 China (+86)</option>
											<option value="+33">🇫🇷 France (+33)</option>
											<option value="+49">🇩🇪 Germany (+49)</option>
											<option value="+852">🇭🇰 Hong Kong (+852)</option>
											<option value="+91">🇮🇳 India (+91)</option>
											<option value="+62">🇮🇩 Indonesia (+62)</option>
											<option value="+98">🇮🇷 Iran (+98)</option>
											<option value="+972">🇮🇱 Israel (+972)</option>
											<option value="+81">🇯🇵 Japan (+81)</option>
											<option value="+60">🇲🇾 Malaysia (+60)</option>
											<option value="+853">🇲🇴 Macau (+853)</option>
											<option value="+64">🇳🇿 New Zealand (+64)</option>
											<option value="+92">🇵🇰 Pakistan (+92)</option>
											<option value="+63" selected>
												🇵🇭 Philippines (+63)
											</option>
											<option value="+7">🇷🇺 Russia (+7)</option>
											<option value="+65">🇸🇬 Singapore (+65)</option>
											<option value="+27">🇿🇦 South Africa (+27)</option>
											<option value="+82">🇰🇷 South Korea (+82)</option>
											<option value="+34">🇪🇸 Spain (+34)</option>
											<option value="+94">🇱🇰 Sri Lanka (+94)</option>
											<option value="+66">🇹🇭 Thailand (+66)</option>
											<option value="+90">🇹🇷 Turkey (+90)</option>
											<option value="+971">
												🇦🇪 United Arab Emirates (+971)
											</option>
											<option value="+44">🇬🇧 United Kingdom (+44)</option>
											<option value="+1">🇺🇸 United States (+1)</option>
										</select>
										<input
											type="tel"
											id="phonenum"
											minLength={10}
											maxLength={10}
											inputMode="numeric"
											pattern="\d*"
											placeholder="Enter phone number"
											onChange={(e) => {
												const input = e.target as HTMLInputElement
												let v = input.value.replace(/\D/g, "") // remove non-digits
												if (v.startsWith("0")) v = v.slice(1) // drop leading 0
												input.value = v
											}}
											onPaste={(e: ClipboardEvent<HTMLInputElement>) => {
												const pasted = e.clipboardData?.getData("text") ?? ""
												const cleaned = pasted
													.replace(/\D/g, "")
													.replace(/^0+/, "")
												e.preventDefault()
												const input = e.target as HTMLInputElement
												input.value = (input.value + cleaned).slice(0, 10)
											}}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="card three"></div>
						<div className="card four"></div>
						<div className="card five"></div>
					</div>
				)}
			</div>
		</>
	)
}
