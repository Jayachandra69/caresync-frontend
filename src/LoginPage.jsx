import { useState } from "react";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password })
            });

if (response.ok) {
    const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "GET",
        credentials: "include"
    });

    if (userResponse.ok) {
        const userData = await userResponse.json();
        onLogin(userData);
    } else {
        setError("Unable to retrieve user information. Please try again.");
    }
} else {
    setError("Invalid username or password.");
}
        } catch (error) {
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand-panel">
                    <div className="hospital-logo">✚</div>
                    <h1 className="login-brand-title">CareSync</h1>
                    <p className="login-brand-subtitle">Healthcare Platform</p>
                    <div className="login-divider"></div>
                    <h2>
                        Every Patient.
                        <br />
                        Every Doctor. In Sync.
                    </h2>
                    <p className="login-brand-description">
                        Bring patients, doctors, and appointments together
                        through one simple, connected healthcare platform.
                    </p>
                    <div className="login-feature"><span>✓</span> Patient Care</div>
                    <div className="login-feature"><span>✓</span> Doctor Directory</div>
                    <div className="login-feature"><span>✓</span> Appointment Scheduling</div>
                    <div className="login-brand-footer">
                        Connecting care through technology
                    </div>
                </div>

                <div className="login-form-panel">
                    <div className="login-welcome-icon">👋</div>
                    <h2 className="login-welcome-title">Welcome Back!</h2>
                    <p className="login-welcome-description">
                        Sign in to continue to your CareSync dashboard.
                    </p>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="login-input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="login-input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        {error && <div className="login-error">⚠️ {error}</div>}

                        <button
                            type="submit"
                            className="login-submit-button"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In →"}
                        </button>
                    </form>

                    <div className="login-security-note">
                        <span>🔒</span>
                        Secure administrator access
                    </div>
                    <p className="login-copyright">© 2026 CareSync</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
