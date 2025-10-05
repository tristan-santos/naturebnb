import "./components/sass/App.scss"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/navbar"
import Home from "./components/pages/Home"
import About from "./components/pages/About"
import Login from "./components/pages/Login"
import Signup from "./components/pages/Signup"

function App() {
	return (
		<>
			<Navbar />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
