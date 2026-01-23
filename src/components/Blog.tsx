import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import LandingPageLayout from './LandingPageLayout';
import { postService } from '../services/postService';
import type { Post } from '../types/post';

export default function Blog() {
    // Reads current user from redux store
    const { user } = useAppSelector((state) => state.auth);
    // Redirect after logout
    const navigate = useNavigate();
    // State to hold blog posts
    const [posts, setPosts] = useState<Post[]>([]);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Loads posts
    useEffect(() => {
        loadPosts();
    }, [currentPage]);

    // Function to get post from the database
    const loadPosts = async () => {
        try {
            setLoading(true);
            setError('');
            // Call API service to get post from which page (currentPage)
            const result = await postService.getPosts(currentPage);
            // Update state with data gotten
            setPosts(result.posts);
            setTotalPages(result.totalPages);
        } catch (err) {
            setError('Failed to load posts.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };
    // Function to delete post from database
    const handleDelete = async (id: string) => {
        if (!confirm('Confirm Post Deletion?')) return;
        try {
            await postService.deletePost(id);
            loadPosts(); // Refresh posts list after deletion
        } catch (err) {
            alert('Failed to delete post.');
            console.error(err);
        }
    };

    // If user is not logged in, show different UI
    if (!user) {
        return (
            <LandingPageLayout>
                <div>
                    <h2 style={{ textAlign: 'center', padding: '30px', backgroundColor: '#00adb5', color: '#fff', borderRadius: '8px' }}>Welcome to Compile-A-B.L.O.G</h2>
                    <p style={{ textAlign: 'center', padding: '10px' }}>Please <a className="underline-on-hover" href="/login" style={{ color: '#00adb5' }}>login</a> or <a className="underline-on-hover" href="/register" style={{ color: '#00adb5' }}>register</a> to start viewing the blogs.</p>
                </div>
            </LandingPageLayout>
        );
    }

    return (
        <Layout>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Compile - A - B.L.O.G</h2>
                    <div>
                        <span style={{ marginRight: '15px' }}>Hello, {user.email}</span>
                        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#00adb5' }}>Logout</button>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, marginBottom: '15px' }}>Books | Literatures | Opinions | Genre</h2>
                </div>

                {/* Button to create new posts */}
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={() => navigate('/create')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#00adb5',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    > Create New Post</button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {loading ? (
                    <p>Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p>There are currently no post available. Create your own now!</p>
                ) : (
                    <>
                        <div>
                            {/* Renders each post */}
                            {posts.map((post) => (
                                <div key={post.id}
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '20px',
                                        marginBottom: '20px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {/* Post Title */}
                                    <h3 style={{ marginTop: 0 }}>{post.title}</h3>
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                    {/* Image Thumbnail */}
                                    {post.image_url && (
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                marginBottom: '15px',
                                            }}
                                        />
                                    )}

                                    {/* Content Preview */}
                                    <p style={{ marginBottom: '15px', opacity: 0.75 }}>
                                        {post.content.substring(0, 100)}
                                        {post.content.length > 100 ? '...' : ''}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {/* View Button */}
                                        <button onClick={() => navigate(`/post/${post.id}`)}
                                            style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#fff', color: '#242424' }}
                                        > View </button>
                                        {/* If logged in user is the creator of the post they can edit and delete, otherwise they can only view */}
                                        {post.user_id === user.id && (
                                            <>
                                                {/* Edit Button */}
                                                <button onClick={() => navigate(`/edit/${post.id}`)}
                                                    style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#00adb5', color: '#fff' }}
                                                > Edit </button>
                                                {/* Delete Button */}
                                                <button onClick={() => handleDelete(post.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#c5172e',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                > Delete </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '10px' }}>
                                {/* Previous page button */}
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: '8px 16px',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                        opacity: currentPage === 1 ? 0.5 : 1,
                                        backgroundColor: '#00adb5',
                                        color: '#fff',
                                    }}
                                > Previous </button>
                                <span style={{ padding: '8x 16px' }}> Page {currentPage} of {totalPages} </span>
                                {/* Next page button */}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        padding: '8px 16px',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                        opacity: currentPage === totalPages ? 0.5 : 1,
                                        backgroundColor: '#00adb5',
                                        color: '#fff',
                                    }}
                                > Next </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}