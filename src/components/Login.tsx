import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Layout2 from './Layout2';

export default function Login() {

    // Creates states to store input value
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Shows loading when logging in is in progress
    const [loading, setLoading] = useState(false);

    // Creates funtion to navigate through different pages/routes
    const navigate = useNavigate();

    // Function to handle the login process
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default form submission behavior
        setLoading(true); // Shows user loading status for better UX
        setError(''); // Resets any previous error messages

        // Calls Supabase to log in existing account
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        // Display error when error occurs
        if (error) {
            setError(error.message);
        } else { // Successful login navigates to home page
            navigate('/');
        }
        setLoading(false); // Login done so no more loading needed
    };

    return (
        <Layout2>
            <div>
                <h2>Login</h2>
                <form onSubmit={handleLogin}> {/* Handles submission for both button click and Enter key */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #00adb5', borderRadius: '4px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #00adb5', borderRadius: '4px' }}
                        />
                    </div>
                    {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#00adb5',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
                <p style={{ marginTop: '20px' }}>
                    {/*Link to registration for new users*/}
                    Don't have an account? <a href="/register" style={{ color: '#00adb5' }}>Register here</a>
                </p>
            </div>
        </Layout2>
    );
}