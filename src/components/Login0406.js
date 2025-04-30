import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {supabase} from '../supabaseClient'; // Ensure this path is correct


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address.');
            return;
        }
        if (!password) {
            setError('Please enter your password.');
            return;
        }

        const {user, error} = await supabase.auth.signInWithPassword({email, password});
        if (error) {
            setError(error.message);
        } else {
            console.log('Login successful:', user);
            navigate('/mold-list');
        }
    };

    return (
        <div>
            <h2>Mold Management System</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email" // name 속성 추가
                        autoComplete="email" // autocomplete 속성 추가
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password" // name 속성 추가
                        autoComplete="current-password" // autocomplete 속성 추가
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account yet? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default Login;

