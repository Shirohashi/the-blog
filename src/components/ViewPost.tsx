import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { postService } from "../services/postService";
import type { Post } from "../types/post";


export default function ViewPost() {
    // Get Post ID
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // States to store post
    const [post, setPost] = useState<Post | null>(null);
    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Loads posts
    useEffect(() => {
        loadPost();
    }, [id]);

    // Get post and store in state
    const loadPost = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError('');
            const data = await postService.getPost(id);
            setPost(data);
        } catch (err) {
            setError('Failed to load post.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <p>Loading post...</p>
            </Layout>
        );
    }

    if (error || !post) {
        return (
            <Layout>
                <div>
                    <p style={{ color: 'red' }}>{error || 'Post not found.'}</p>
                    <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}>
                        Back to Home
                    </button>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div>
                {/* Back to Homepage button */}
                <button onClick={() => navigate('/')}
                    style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
                > Back to Home </button>

                <h1 style={{ marginBottom: '10px' }}>{post.title}</h1>
                {/* Show creation date */}
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>
                    Created on {new Date(post.created_at).toLocaleDateString()} at {''}
                    {new Date(post.created_at).toLocaleTimeString()}
                </p>

                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {post.content}
                </div>
            </div>
        </Layout>
    );
}    