import { use, useEffect, useRef, useState } from "react"
import type { ClipboardEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../sass/becomeHost.scss"
import "../sass/setup.scss"
import termsAndConditions from "../types/terms"
import check from "../../assets/icons/checked.png"
import close from "../../assets/icons/multiply.png"
import logo from "../../assets/logoNobgWhite.png"
import StepCounter from "../../components/types/stepCounter"
import getCountry from "../types/getCountry"
import AnimatedCheck from "../types/animatedCheck"
import type { UserInfo } from "firebase/auth"

interface users {
	uid: string
	email: string
	password: string
	role: string
	name: {
		suffix: string
		firstname: string
		middlename: string
		lastname: string
	}
	gender: string

	phoneNumber: {
		country: string
		number: string
	}
	dateOfBirth: {
		year: string
		month: string
		day: day
	}
	address: {
		province: string
		city: string
		street: string
		addressLine: string
		zipCode: string
	}
	createdAt: Date
	lastLoginAt: Date
}

export default function Setup() {
	const [user, setUser] = useState<users | null>(null)
	const [formData, setFormData] = useState({
		suffix: "",
		firstname: "",
		lastname: "",
		mname: "",
		gender: "",
		country: "",
		number: "",
		year: "",
		month: "",
		day: 0,
		province: "",
		city: "",
		street: "",
		addressLine: "",
		zipCode: "",
	})
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

	const handleClick = () => {
		const use = userInfo.user
		const newUser: users = {
			uid: use.uid,
			email: use.email,
			password: use.password,
			role: use.role,
			name: {
				suffix: formData.suffix,
				firstname: formData.firstname,
				middlename: formData.firstname,
				lastname: formData.lastname,
			},
			gender: formData.gender,
			phoneNumber: { country: formData.country, number: formData.number },
			dateOfBirth: {
				year: formData.year,
				month: formData.month,
				day: formData.day,
			},
			address: {
				province: formData.province,
				city: formData.city,
				street: formData.street,
				addressLine: formData.addressLine,
				zipCode: formData.zipCode,
			},
			createdAt: new Date(),
			lastLoginAt: new Date(),
		}

		setUser(newUser)
		console.log("User object:", newUser)
	}
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
		setCurrentIndex(currentIndex + 1)
	}

	const handlePrevious = () => {
		setCurrentIndex(currentIndex - 1)
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
	interface BirthDate {
		day: string
		month: string
		year: string
	}

	interface Address {
		country: string
		province: string
		city: string
		street: string
		address1: string
		address2?: string
		zip: string
	}

	const [birthDate, setBirthDate] = useState<BirthDate>({
		day: "",
		month: "",
		year: "",
	})

	const [address, setAddress] = useState<Address>({
		country: "",
		province: "",
		city: "",
		street: "",
		address1: "",
		address2: "",
		zip: "",
	})

	const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]
	const years = Array.from({ length: 100 }, (_, i) => (2025 - i).toString())

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
										onChange={(e) =>
											setFormData({ ...formData, firstname: e.target.value })
										}
									/>
								</div>

								<div className="suffix">
									<label htmlFor="suffix">Suffix:</label>
									<select
										id="suffix"
										name="suffix"
										onChange={(e) =>
											setFormData({ ...formData, suffix: e.target.value })
										}
										required
									>
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
										onChange={(e) =>
											setFormData({ ...formData, lastname: e.target.value })
										}
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
										onChange={(e) =>
											setFormData({ ...formData, mname: e.target.value })
										}
									/>
								</div>
							</div>

							<div className="gender">
								<div className="male">
									<label htmlFor="male">Male</label>
									<input
										type="radio"
										id="male"
										name="gender"
										value="Male"
										checked={formData.gender === "Male"}
										onChange={(e) =>
											setFormData({ ...formData, gender: e.target.value })
										}
									/>
								</div>
								<div className="female">
									<label htmlFor="female">Female</label>
									<input
										type="radio"
										id="female"
										name="gender"
										value="Female"
										checked={formData.gender === "Female"}
										onChange={(e) =>
											setFormData({ ...formData, gender: e.target.value })
										}
									/>
								</div>
								<div className="prefer">
									<label htmlFor="prefer">Attack Helicopter</label>
									<input
										type="radio"
										id="prefer"
										name="gender"
										value="Prefer"
										checked={formData.gender === "Prefer"}
										onChange={(e) =>
											setFormData({ ...formData, gender: e.target.value })
										}
									/>
								</div>
							</div>

							<div className="phoneNum">
								<div className="countries">
									<select
										id="country"
										name="country"
										onChange={(e) => {
											console.log(
												getCountry(e.target.value) + " " + e.target.value
											)
											setFormData({
												...formData,
												country:
													getCountry(e.target.value) + " " + e.target.value,
											})
										}}
										required
									>
										<option value="" selected>
											-- Select Country --
										</option>
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
										<option value="+63">🇵🇭 Philippines (+63)</option>
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
											setFormData({ ...formData, number: e.target.value })
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
											setAddress((prev) => ({
												...prev,
												country: getCountry(country.value),
											}))
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
							<StepCounter currentStep={2} />
						</div>

						<div className="form">
							<div className="form step-three">
								<div className="birthdate">
									<h3>Birth Date</h3>
									<div className="birth-select">
										<select
											value={birthDate.day}
											onChange={(e) => {
												setFormData({
													...formData,
													day: Number(e.target.value),
												})
												setBirthDate({ ...birthDate, day: e.target.value })
											}}
										>
											<option value="">Day</option>
											{days.map((d) => (
												<option key={d} value={d}>
													{d}
												</option>
											))}
										</select>

										<select
											value={birthDate.month}
											onChange={(e) => {
												setBirthDate({ ...birthDate, month: e.target.value })
												setFormData({ ...formData, month: e.target.value })
											}}
										>
											<option value="">Month</option>
											{months.map((m) => (
												<option key={m} value={m}>
													{m}
												</option>
											))}
										</select>

										<select
											value={birthDate.year}
											onChange={(e) => {
												setBirthDate({ ...birthDate, year: e.target.value })
												setFormData({ ...formData, year: e.target.value })
											}}
										>
											<option value="">Year</option>
											{years.map((y) => (
												<option key={y} value={y}>
													{y}
												</option>
											))}
										</select>
									</div>
								</div>
								{/* ✅ Address Section */}
								<h3>Address</h3>
								<div className="address">
									<input
										type="text"
										value={address.country}
										readOnly
										placeholder="Country"
										onChange={(e) =>
											setFormData({ ...formData, country: e.target.value })
										}
									/>
									<input
										type="text"
										value={address.province}
										onChange={(e) => {
											setFormData({ ...formData, province: e.target.value })
											setAddress({ ...address, province: e.target.value })
										}}
										placeholder="Province"
									/>
									<input
										type="text"
										value={address.city}
										onChange={(e) => {
											setFormData({ ...formData, city: e.target.value })
											setAddress({ ...address, city: e.target.value })
										}}
										placeholder="City"
									/>
									<input
										type="text"
										value={address.street}
										onChange={(e) => {
											setFormData({ ...formData, street: e.target.value })
											setAddress({ ...address, street: e.target.value })
										}}
										placeholder="Street"
									/>
									<input
										type="text"
										value={address.address1}
										onChange={(e) => {
											setFormData({ ...formData, addressLine: e.target.value })
											setAddress({ ...address, address1: e.target.value })
										}}
										placeholder="Address Line 1"
									/>

									<input
										type="text"
										value={address.zip}
										onChange={(e) => {
											setFormData({ ...formData, zipCode: e.target.value })
											setAddress({ ...address, zip: e.target.value })
										}}
										placeholder="ZIP Code"
									/>
								</div>
								<div className="button">
									<button className="prev" onClick={handlePrevious}>
										Previous
									</button>
									<button
										className="next"
										onClick={() => {
											const missingFields: string[] = []

											// Validate birth date selects
											const [daySel, monthSel, yearSel] = Array.from(
												document.querySelectorAll<HTMLSelectElement>(
													".birth-select select"
												)
											)
											if (!birthDate.day) {
												missingFields.push("Day")
												if (daySel) daySel.style.border = "2px solid red"
											} else if (daySel) {
												daySel.style.border = ""
											}

											if (!birthDate.month) {
												missingFields.push("Month")
												if (monthSel) monthSel.style.border = "2px solid red"
											} else if (monthSel) {
												monthSel.style.border = ""
											}

											if (!birthDate.year) {
												missingFields.push("Year")
												if (yearSel) yearSel.style.border = "2px solid red"
											} else if (yearSel) {
												yearSel.style.border = ""
											}

											// Validate address inputs (order in JSX: country, province, city, street, address1, address2, zip)
											const addrInputs = Array.from(
												document.querySelectorAll<HTMLInputElement>(
													".address input"
												)
											)
											const [
												provinceInput,
												cityInput,
												streetInput,
												address1Input,
												zipInput,
											] = addrInputs

											// Province
											if (!address.province?.trim()) {
												missingFields.push("Province")
												if (provinceInput)
													provinceInput.style.border = "2px solid red"
											} else if (provinceInput) {
												provinceInput.style.border = ""
											}

											// City
											if (!address.city?.trim()) {
												missingFields.push("City")
												if (cityInput) cityInput.style.border = "2px solid red"
											} else if (cityInput) {
												cityInput.style.border = ""
											}

											// Street
											if (!address.street?.trim()) {
												missingFields.push("Street")
												if (streetInput)
													streetInput.style.border = "2px solid red"
											} else if (streetInput) {
												streetInput.style.border = ""
											}

											// Address Line 1
											if (!address.address1?.trim()) {
												missingFields.push("Address Line 1")
												if (address1Input)
													address1Input.style.border = "2px solid red"
											} else if (address1Input) {
												address1Input.style.border = ""
											}

											// ZIP
											if (!address.zip?.trim()) {
												missingFields.push("ZIP Code")
												if (zipInput) zipInput.style.border = "2px solid red"
											} else if (zipInput) {
												zipInput.style.border = ""
											}

											// Add live clearing of red borders for the fields we validated
											;[daySel, monthSel, yearSel].forEach((el) => {
												if (!el) return
												el.addEventListener("change", () => {
													el.style.border = ""
												})
											})
											;[
												provinceInput,
												cityInput,
												streetInput,
												address1Input,
												zipInput,
											].forEach((el) => {
												if (!el) return
												el.addEventListener("input", () => {
													if (el.value.trim()) el.style.border = ""
												})
											})

											if (missingFields.length > 0) {
												return
											}

											handleNext()
										}}
									>
										Next
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* CARD FOUR */}
					<div
						className="card four"
						ref={(el) => {
							if (el) cardsRef.current[3] = el
						}}
					>
						<div className="logo">
							<img src={logo} alt="logo" />
							<span>NatureBnb</span>
						</div>

						<div className="center">
							<div className="box">
								<div className="text">
									<span>You're all set!!</span>
								</div>
								<div className="img">
									<AnimatedCheck />
								</div>
								<div className="button">
									<button
										onClick={() => {
											handleClick()
											console.log(formData)
											// navigate("/dashbaordHost")
										}}
									>
										Continue to Dashboard
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
