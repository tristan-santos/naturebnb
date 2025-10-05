import "./css/form.css"
import googlePng from "./img/google.png"
import welcomePng from "./img/Computer login-amico.png"

function formLogin() {
	return (
		<div className="centered-div">
			<div className="side-boxes">
				<div className="box login-box">
					<form className="login-form" autoComplete="off">
						<div className="login-header">
							<h2>Login</h2>
							<p className="subtitle">Sign in to your account below</p>
						</div>
						<div className="login-fields">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								required
								autoComplete="username"
							/>
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								name="password"
								required
								autoComplete="current-password"
							/>
						</div>
						<div className="login-options">
							<button className="forgot-password">Forgot password?</button>
							<div className="remember-me">
								<label className="switch">
									<input type="checkbox" id="remember" name="remember" />
									<span className="slider"></span>
								</label>
								<span>Remember me</span>
							</div>
						</div>
						<div className="login-action">
							<button type="submit" className="login-btn">
								Login
							</button>
						</div>
						<div className="or-divider">
							<span>or</span>
						</div>
						<div className="google-login">
							<button type="button" className="google-btn">
								<img src={googlePng} alt="Google" className="google-icon" />
								Continue with Google
							</button>
						</div>
						<div className="signup-section">
							<span>Do you have an account?</span>
							<button type="button" className="signup-btn">
								Signup
							</button>
						</div>
					</form>
				</div>
				<div className="box info-box">
					<div className="info-content">
						<h2 className="info-title">Welcome back to Adv Web</h2>
						<div className="info-image-wrapper">
							<img src={welcomePng} alt="Welcome" className="info-image" />
						</div>
						<p className="info-subtitle">We're glad to see you again!</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default formLogin
