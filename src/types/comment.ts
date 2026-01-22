export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateCommentData {
    post_id: string;
    content: string;
    image_url?: string;
}