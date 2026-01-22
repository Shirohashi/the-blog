import { useState, useRef } from "react";
import { storageService } from '../services/storageService';

interface ImageUploadProps {
    onImageUploaded: (url: string) => void;
    currentImageUrl?: string;
    folder: 'posts' | 'comments';
}

export default function ImageUpload({ onImageUploaded, currentImageUrl, folder }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Valdiate file size
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError('');
            const url = await storageService.uploadImage(file, folder);
            onImageUploaded(url);
        } catch (err) {
            setError('Failed to upload image');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (currentImageUrl) {
            try {
                await storageService.deleteImage(currentImageUrl);
                onImageUploaded('');
            } catch (err) {
                console.error('Failed to delete image:', err)
            }
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Image (optional)
            </label>

            {currentImageUrl ? (
                <div>
                    <img src={currentImageUrl}
                        alt="Preview"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            borderRadius: '4px',
                            marginBottom: '10px'
                        }}
                    />
                    <div>
                        <button type="button"
                            onClick={handleRemoveImage}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        > Remove Image </button>
                    </div>
                </div>
            ) : (
                <>
                    <input ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <button type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#00adb5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                        }}
                    > {uploading ? 'Uploading...' : 'Choose Image'} </button>
                </>
            )}

            {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
        </div>
    );
}