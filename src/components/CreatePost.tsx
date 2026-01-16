import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { postService } from "../services/postService";

export default function CreatePost() {
    // Redirect to home page after successful creation
    const navigate = useNavigate();
    // States for title and content of post
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // State for when form gets submitted
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handles form submission and prevent default form submission behavior
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensures Title and Content are not empty
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required.');
            return;
        }

        // Calls API to create post
        try {
            setLoading(true);
            setError('');
            await postService.createPost({ title, content });
            navigate('/');
        } catch (err) {
            setError('Failed to create post.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div>
                <h2>Create New Post</h2>
                <form onSubmit={handleSubmit} style={{ marginTop: '40px' }}>
                    {/* Title Area */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #00adb5',
                                borderRadius: '4px',
                            }}
                            placeholder="Enter post title"
                        />
                    </div>
                    {/* Content Area */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Content
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={10}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #00adb5',
                                borderRadius: '4px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                            }}
                            placeholder="Write your post content..."
                        />
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Create Post Button */}
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
                                fontSize: '16px',
                            }}
                        > {loading ? 'Creating Post...' : 'Create Post'}
                        </button>
                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#c5172e',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}
                        > Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}    