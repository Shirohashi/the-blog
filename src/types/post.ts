export interface Post {
    id: string; // Unique Identifier for post
    title: string; // Post title
    content: string; // Post content
    user_id: string; // User that posted
    image_url?: string; // Optional image attachment
    created_at: string; // Timestamps
    updated_at: string; // Timestamps
}

// Creating Post
export interface CreatePost {
    title: string;
    content: string;
    image_url?: string;
}

// Updating Post
export interface UpdatePost {
    title: string;
    content: string;
    image_url?: string;
}

