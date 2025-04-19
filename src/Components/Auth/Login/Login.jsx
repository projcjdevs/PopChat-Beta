import '../../../Styles/Greetings.css'; // Fix the path
import { doSignInWithEmailAndPassword } from '../../../Firebase/auth'; // Use your existing function
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onBack }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        try {
            await doSignInWithEmailAndPassword(email, password); // Call your Firebase function
            console.log('Login successful');
            navigate('/chat');
        } catch (err) {
            console.error('Login failed:', err.message);
            setError(err.message); // Display error message
        }
    };

    return (
        <>
            <div className="form-container">
                <h2>Log In</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update email state
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"} // Toggle between text and password
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Update password state
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                            >
                                {showPassword ? (
                                    <i className="fa-solid fa-eye-slash"></i> // Eye-slash icon for hiding
                                ) : (
                                    <i className="fa-solid fa-eye"></i> // Eye icon for showing
                                )}
                            </button>
                        </div>
                    </div>
                    {error && <p className="error-message">{error}</p>} {/* Display error message */}
                    <div className="form-actions">
                        <button type="button" onClick={onBack}>Back</button>
                        <button type="submit" className="submit-btn">Log In</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;