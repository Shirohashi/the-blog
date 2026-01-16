export interface Post {
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePost {
    title: string;
    content: string;
}

export interface UpdatePost {
    title: string;
    content: string;
}

