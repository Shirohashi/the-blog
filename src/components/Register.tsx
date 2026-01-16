import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabase';
import Layout2 from "./Layout2";

export default function Register() {

    // Creates states to store input value
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Shows loading when registration is in progress
    const [loading, setLoading] = useState(false);

    // Creates funtion to navigate through different pages/routes
    const navigate = useNavigate();

    // Function to handle the registration process 
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default form submission behavior
        setLoading(true); // Shows user loading status for better UX
        setError(''); // Resets any previous error messages

        // Calls Supabase to create new account
        const { error } = await supabase.auth.signUp({ email, password });

        // Display error when error occurs
        if (error) {
            setError(error.message);
        } else { // No email confirmation required
            navigate('/');
        }
        setLoading(false); // Registration done so no more loading needed
    };

    return (
        <Layout2>
            <div>
                <h2>Register</h2>
                <form onSubmit={handleRegister}> {/* Handles submission for both button click and Enter key */}
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
                            cursor: loading ? 'not-allowed' : 'pointer', // Changes cursor based on loading state
                            fontSize: '14px',
                        }}
                    >
                        {loading ? 'Loading...' : 'Register'}
                    </button>
                </form>
                <p style={{ marginTop: '20px' }}>
                    {/*Link to login page for existing users*/}
                    Already have an account? <a href="/login" style={{ color: '#00adb5' }}>Login here</a>
                </p>
            </div>
        </Layout2>
    );
}