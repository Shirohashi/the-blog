import { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { commentService } from "../services/commentService";
import { storageService } from "../services/storageService";
import type { Comment } from "../types/comment";
import ImageUpload from './ImageUpload';

interface CommentsProps {
    postId: string;
}

export default function Comments({ postId }: CommentsProps) {
    const { user } = useAppSelector((state) => state.auth);
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        try {
            const data = await commentService.getComments(postId);
            setComments(data);
        } catch (err) {
            console.error('Failed to load comments', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await commentService.createComment({
                post_id: postId,
                content,
                image_url: imageUrl || undefined,
            });
            setContent('');
            setImageUrl('');
            loadComments();
        } catch (err) {
            setError('Failed to post comment');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, commentImageUrl?: string) => {
        if (!confirm('Confirm comment deletion?')) return;

        try {
            await commentService.deleteComment(id);
            if (commentImageUrl) {
                await storageService.deleteImage(commentImageUrl);
            }
            loadComments();
        } catch (err) {
            alert('Failed to delete comment');
            console.error(err);
        }
    };

    if (!user) {
        return (
            <div style={{ marginTop: '40px' }}>
                <h3>Comments</h3>
                <p>Please log in to comment</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
            <h3>Comments ({comments.length})h</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} style={{ marginTop: '20px', marginBottom: '30px' }}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                    }}
                />
                <ImageUpload
                    onImageUploaded={setImageUrl}
                    currentImageUrl={imageUrl}
                    folder="comments"
                />

                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#00adb5',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                > {loading ? 'Posting...' : 'Post Comment'}</button>
            </form>

            {/* List of Comments */}
            <div>
                {comments.length === 0 ? (
                    <p style={{ color: '#666' }}>No comments yet. Be the first to comment.</p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            style={{
                                padding: '15px',
                                marginBottom: '15px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '4px',
                                border: '1px solid #eee',
                            }}
                        >
                            <p style={{ marginBottom: '10px' }}>{comment.content}</p>

                            {comment.image_url && (
                                <img
                                    src={comment.image_url}
                                    alt="Comment attachment"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        borderRadius: '4px',
                                        marginBottom: '10px',
                                    }}
                                />
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                <small style={{ color: '#666' }}>
                                    {new Date(comment.created_at).toLocaleString()}
                                </small>

                                {comment.user_id === user.id && (
                                    <button
                                        onClick={() => handleDelete(comment.id, comment.image_url)}
                                        style={{
                                            padding: '4px 8px',
                                            fontSize: '12px',
                                            backgroundColor: '#dc3545',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    > Delete </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
