import "./components/sass/App.scss"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Landing from "./components/pages/Landing"
import BecomeHost from "./components/pages/becomeHost"
import Login from "./components/pages/Login"
import Signup from "./components/pages/Signup"
import Setup from "./components/pages/setup"
import NotFound from "./components/pages/404"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/BecomeHost" element={<BecomeHost />} />
				<Route path="/setup" element={<Setup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
