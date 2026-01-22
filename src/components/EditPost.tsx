import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { postService } from "../services/postService";
import ImageUpload from "./ImageUpload";

export default function EditPost() {
    // Get Post ID
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // States
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    // State for when post is being updated
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Loads Posts
    useEffect(() => {
        loadPost();
    }, [id]);

    // Get post and store in state
    const loadPost = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError('');
            const post = await postService.getPost(id);
            setTitle(post.title);
            setContent(post.content);
            setImageUrl(post.image_url || '');
        } catch (err) {
            setError('Failed to load post.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handles form submission and prevent default form submission behavior
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensures id exists and that Title and Content are filled
        if (!id || !title.trim() || !content.trim()) {
            setError('Title and content are required.');
            return;
        }
        // Updating post | Update success redirects to home page
        try {
            setSaving(true);
            setError('');
            await postService.updatePost(id, {
                title,
                content,
                image_url: imageUrl || undefined
            });
            navigate('/');
        } catch (err) {
            setError('Failed to update post.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <p>Loading post...</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <div>
                <h2>Edit Post</h2>
                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
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
                        />
                    </div>

                    <ImageUpload
                        onImageUploaded={setImageUrl}
                        currentImageUrl={imageUrl}
                        folder="posts"
                    />

                    {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Save Changes Button */}
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#00adb5',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                            }}
                        > {saving ? 'Saving...' : 'Save Changes'}
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