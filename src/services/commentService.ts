import { supabase } from '../lib/supabase';
import type { Comment, CreateCommentData } from '../types/comment';

export const commentService = {
    // Get all comments for a post
    async getComments(postID: string): Promise<Comment[]> {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postID)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return data || [];
    },

    // Create new comment
    async createComment(commentData: CreateCommentData): Promise<Comment> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('comments')
            .insert([{ ...commentData, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    // Delete comment
    async deleteComment(id: string): Promise<void> {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};