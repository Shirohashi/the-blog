export interface Post {
    id: string;
    title: string;
    content: string;
    user_id: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePost {
    title: string;
    content: string;
    image_url?: string;
}

export interface UpdatePost {
    title: string;
    content: string;
    image_url?: string;
}

