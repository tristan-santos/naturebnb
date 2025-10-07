import "./components/sass/App.scss"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/types/navbar"
import Landing from "./components/pages/Landing"
import BecomeHost from "./components/pages/becomeHost"
import Login from "./components/pages/Login"
import Signup from "./components/pages/Signup"

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/BecomeHost" element={<BecomeHost />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
