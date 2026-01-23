export interface Comment {
    id: string; // Unique Identifier for comment
    post_id: string; // Which post the comment belongs to
    user_id: string; // User that commented
    content: string; // Comment content
    image_url?: string; // Optional image attachment
    created_at: string; // Timestamps
    updated_at: string; // Timestamps
}

// Creating Comment
export interface CreateCommentData {
    post_id: string;
    content: string;
    image_url?: string;
}