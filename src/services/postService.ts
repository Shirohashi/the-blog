import { supabase } from '../lib/supabase';
import type { Post, CreatePost, UpdatePost } from '../types/post';
import { storageService } from './storageService';

const POSTS_PER_PAGE = 4; // Only 4 posts per page

export const postService = {
    // Get paginated posts + Helps UI to know total and current page(s)
    async getPosts(page: number = 1): Promise<{ posts: Post[]; totalPages: number; currentPage: number }> {
        const from = (page - 1) * POSTS_PER_PAGE; // Pagination math
        const to = from + POSTS_PER_PAGE - 1; // Calculate end index for each page

        // Get total number of posts for pagination
        const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })

        // Get posts for the current page
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // Math to calculate total pages rounded up to nearest whole number
        const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

        // Return what the UI needs
        return {
            posts: data || [], // Display posts or empty array
            totalPages, // Total pages for pagination
            currentPage: page, // Highlight current page
        };
    },

    // Get a single post by ID
    async getPost(id: string): Promise<Post> {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return data;
    },

    // Create new blog posts
    async createPost(postData: CreatePost): Promise<Post> {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Must be logged in to post (backend validation)
        if (!user) throw new Error('User not authenticated');

        // Insert new post to database
        const { data, error } = await supabase
            .from('posts')
            .insert([{ ...postData, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    // Update existing posts
    async updatePost(id: string, postData: UpdatePost): Promise<Post> {
        // Update post in database
        const { data, error } = await supabase
            .from('posts')
            .update({ ...postData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return data;
    },
    // Delete existing post or image
    async deletePost(id: string): Promise<void> {
        // Get post to find image url
        const { data: post } = await supabase
            .from('posts')
            .select('image_url')
            .eq('id', id)
            .single();

        // Delete post from database
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Delete image as well for deleted posts
        if (post?.image_url) {
            try {
                await storageService.deleteImage(post.image_url);
            } catch (err) {
                console.error('Failed to delete image:', err);
            }
        }
    },
};