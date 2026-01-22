import { supabase } from '../lib/supabase';

export const storageService = {
    // Upload the image to supabase storage
    // Organizes image to upload whether to put it posts or comments
    async uploadImage(file: File, folder: 'posts' | 'comments'): Promise<string> {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        // Create unique filename
        const fileExt = file.name.split('.').pop(); // File extension
        const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`; // Creates unique path

        // Upload file to post-images bucket
        const { data, error } = await supabase.storage.from('post-images').upload(fileName, file, {
            cacheControl: '3600', upsert: false
        });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(data.path);

        return publicUrl;
    },

    // Delete image from storage
    async deleteImage(url: string): Promise<void> {
        // Extract path from URL
        const path = url.split('/post-images/')[1];

        if (!path) return;

        const { error } = await supabase.storage.from('post-images').remove([path]);

        if (error) throw error;
    }
};