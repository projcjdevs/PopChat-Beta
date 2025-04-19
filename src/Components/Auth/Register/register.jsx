import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../../../Firebase/auth';
import { db } from '../../../Firebase/firebase'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register({ onBack }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Store additional user details in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: email,
                createdAt: new Date(),
                typing: false, // Add the typing field
            });

            console.log('Registration successful');
            setSuccess('Account created successfully! You can now log in.');
            setError('');

            setTimeout(() => {
                navigate('/chat');
            }, 1000);
        } catch (err) {
            console.error('Registration failed:', err.message);
            setError(err.message);
            setSuccess('');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await doSignInWithGoogle();
            const user = result.user;

            // Store user details in Firestore if signing in with Google
            await setDoc(doc(db, 'users', user.uid), {
                username: user.displayName,
                email: user.email,
                createdAt: new Date(),
                typing: false, // Add the typing field
            });

            console.log('Google Sign-In successful:', user);
            navigate('/chat');
        } catch (err) {
            console.error('Google Sign-In failed:', err.message);
            setError(err.message);
        }
    };

    return (
        <>
            <div className="form-container">
                <h2>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="name">Username</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"} // Toggle between text and password
                                id="reg-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                            >
                                {showPassword ? (
                                    <i className="fa-solid fa-eye"></i> // Eye-slash icon for hiding
                                ) : (
                                    <i className="fa-solid fa-eye-slash"></i> // Eye icon for showing
                                )}
                            </button>
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <div className="form-actions">
                        <button type="button" onClick={onBack}>Back</button>
                        <button type="submit" className="submit-btn">Create Account</button>
                    </div>
                </form>

                <div className="google-signin">
                    <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </>
    );
}

export default Register;