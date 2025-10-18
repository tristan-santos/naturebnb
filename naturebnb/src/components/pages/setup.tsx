import { useEffect, useRef, useState } from "react"
import type { ClipboardEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../sass/becomeHost.scss"
import "../sass/setup.scss"
import termsAndConditions from "../types/terms"
import check from "../../assets/icons/checked.png"
import close from "../../assets/icons/multiply.png"
import logo from "../../assets/logoNobgWhite.png"
import StepCounter from "../../components/types/stepCounter"

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

	const cardsRef = useRef<HTMLDivElement[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		if (!userInfo) {
			console.warn("No user information provided. Redirecting to login.")
			navigate("/", { replace: true })
		} else {
			console.log("User information received:", userInfo)
		}
	}, [userInfo, navigate])

	const updateCardClasses = (index: number) => {
		cardsRef.current.forEach((card, i) => {
			card.classList.remove("active", "previous", "next")
			if (i === index) card.classList.add("active")
			else if (i < index) card.classList.add("previous")
			else if (i > index) card.classList.add("next")
		})
	}

	useEffect(() => {
		updateCardClasses(currentIndex)
	}, [currentIndex])

	const handleNext = () => {
		setCurrentIndex((prev) => Math.min(prev + 1, cardsRef.current.length - 1))
	}

	const handlePrevious = () => {
		setCurrentIndex((prev) => Math.max(prev - 1, 0))
	}

	const handleAgree = () => {
		const cards = cardsRef.current
		if (!cards[0] || !cards[1] || !cards[2]) return
		cards[0].classList.remove("active")
		cards[1].classList.add("active")
		cards[2].classList.add("next")
	}

	const handleDisagree = () => {
		navigate("/")
	}

	const handleHover = (hovered: boolean) => {
		const cards = cardsRef.current
		if (!cards[0]) return
		if (hovered) {
			cards[0].classList.add("hovered")
		} else {
			cards[0].classList.remove("hovered")
		}
	}

	return (
		<div className="container">
			{userInfo && (
				<div className="box">
					{/* CARD ONE */}
					<div
						className="card one active"
						ref={(el) => {
							if (el) cardsRef.current[0] = el
						}}
					>
						<div className="logo">
							<img src={logo} alt="logo" />
							<span>NatureBnb</span>
						</div>
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
							<button className="agree" onClick={handleAgree}>
								<img src={check} alt="check" />
								Agree
							</button>

							<button
								className="disagree"
								onClick={handleDisagree}
								onMouseEnter={() => handleHover(true)}
								onMouseLeave={() => handleHover(false)}
							>
								<img src={close} alt="close" />
								Disagree
							</button>
						</div>
					</div>

					{/* CARD TWO */}
					<div
						className="card two"
						ref={(el) => {
							if (el) cardsRef.current[1] = el
						}}
					>
						<div className="logo">
							<img src={logo} alt="logo" />
							<span>NatureBnB</span>
						</div>
						<div className="title">
							<div className="steps">
								<span>Steps: </span>
							</div>
							<StepCounter currentStep={currentIndex + 1} />
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
									<input type="text" id="lname" placeholder="input last name" />
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
								<div className="prefer">
									<label htmlFor="prefer">Attack Helicopter</label>
									<input
										type="radio"
										id="prefer"
										name="gender"
										value="prefer"
										checked
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
										<option value="+971">🇦🇪 United Arab Emirates (+971)</option>
										<option value="+44">🇬🇧 United Kingdom (+44)</option>
										<option value="+1">🇺🇸 United States (+1)</option>
									</select>
									<input
										type="tel"
										id="phonenum"
										minLength={10}
										maxLength={10}
										inputMode="numeric"
										pattern="\\d*"
										placeholder="Enter phone number"
										onChange={(e) => {
											const input = e.target as HTMLInputElement
											let v = input.value.replace(/\D/g, "")
											if (v.startsWith("0")) v = v.slice(1)
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

							<div className="button">
								<button
									className="next"
									onClick={() => {
										const fname =
											document.querySelector<HTMLInputElement>("#fname")
										const lname =
											document.querySelector<HTMLInputElement>("#lname")
										const mname =
											document.querySelector<HTMLInputElement>("#mname")
										const suffix =
											document.querySelector<HTMLSelectElement>("#suffix")
										const male =
											document.querySelector<HTMLInputElement>("#male")
										const female =
											document.querySelector<HTMLInputElement>("#female")
										const prefer =
											document.querySelector<HTMLInputElement>("#prefer")
										const country =
											document.querySelector<HTMLSelectElement>("#country")
										const number =
											document.querySelector<HTMLInputElement>("#phonenum")
										const missingFields: string[] = []

										// ensure errorDiv exists before proceeding

										// Reset function for all inputs
										// Validate inputs with proper null checks and types
										if (!fname || !fname.value.trim()) {
											missingFields.push("First Name")
											if (fname)
												(fname as HTMLElement).style.border = "2px solid red"
										} else {
											;(fname as HTMLElement).style.border = ""
										}

										if (!lname || !lname.value.trim()) {
											missingFields.push("Last Name")
											if (lname)
												(lname as HTMLElement).style.border = "2px solid red"
										} else {
											;(lname as HTMLElement).style.border = ""
										}

										if (!mname || !mname.value.trim()) {
											missingFields.push("Middle Name")
											if (mname)
												(mname as HTMLElement).style.border = "2px solid red"
										} else {
											;(mname as HTMLElement).style.border = ""
										}

										// Accepts None suffix (the select has a None option with empty value)
										if (!suffix) {
											// if the element is missing entirely, mark as missing
											missingFields.push("Suffix")
										} else {
											;(suffix as HTMLElement).style.border = ""
										}

										if (!country || !country.value.trim()) {
											missingFields.push("Country")
											if (country)
												(country as HTMLElement).style.border = "2px solid red"
										} else {
											;(country as HTMLElement).style.border = ""
										}

										if (!number || !number.value.trim()) {
											missingFields.push("Phone Number")
											if (number)
												(number as HTMLElement).style.border = "2px solid red"
										} else if (number.value.trim().length !== 10) {
											missingFields.push("Phone Number must be 10 digits")
											;(number as HTMLElement).style.border = "2px solid red"
										} else {
											;(number as HTMLElement).style.border = ""
										}

										// Validate gender (same logic as others) and use the actual container class
										const genderContainer =
											document.querySelector<HTMLElement>(".gender")
										if (
											!male?.checked &&
											!female?.checked &&
											!prefer?.checked
										) {
											missingFields.push("Gender")
											if (genderContainer)
												genderContainer.style.border = "2px solid red"
										} else {
											if (genderContainer) genderContainer.style.border = ""
										}

										// Live border removal (for text/select inputs)
										;[fname, lname, mname, suffix, country, number].forEach(
											(input) => {
												if (!input) return
												input.addEventListener("input", () => {
													// value exists on both HTMLInputElement and HTMLSelectElement
													if (
														(
															input as HTMLInputElement | HTMLSelectElement
														).value.trim()
													) {
														;(input as HTMLElement).style.border = ""
													}
												})
											}
										)

										// Live border removal (for gender selection)
										;[male, female, prefer].forEach((gender) => {
											if (!gender) return
											gender.addEventListener("change", () => {
												if (genderContainer) genderContainer.style.border = ""
											})
										})

										if (missingFields.length > 0) {
											//as
										} else {
											handleNext()
										}
									}}
								>
									Next
								</button>
							</div>
						</div>
					</div>

					{/* CARD THREE */}
					<div
						className="card three"
						ref={(el) => {
							if (el) cardsRef.current[2] = el
						}}
					>
						<div className="logo">
							<img src={logo} alt="logo" />
							<span>NatureBnb</span>
						</div>

						<div className="title">
							<div className="steps">
								<span>Steps: </span>
							</div>
							{/* Use StepCounter here */}
							<StepCounter currentStep={2} />
						</div>

						{/* Example form content */}
						<div className="form">
							<p>Welcome to Step 3 — fill out your property details here.</p>
							{/* Add your input fields or form section for step 3 below */}
						</div>
					</div>

					{/* CARD FOUR */}
					<div
						className="card four"
						ref={(el) => {
							if (el) cardsRef.current[3] = el
						}}
					></div>

					{/* CARD FIVE */}
					<div
						className="card five"
						ref={(el) => {
							if (el) cardsRef.current[4] = el
						}}
					></div>
				</div>
			)}
		</div>
	)
}
