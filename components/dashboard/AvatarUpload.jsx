'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Camera, X } from 'lucide-react';
import { getFullAvatarUrl } from '@/lib/api';

export default function AvatarUpload({
    currentUser,
    userInitials,
    onAvatarChange,
    isLoading = false
}) {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Please upload an image smaller than 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
                if (onAvatarChange) {
                    onAvatarChange(file);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [onAvatarChange]);

    const handleRemove = useCallback(() => {
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onAvatarChange) {
            onAvatarChange(null); // null means remove avatar
        }
    }, [onAvatarChange]);

    return (
        <div className="flex items-center gap-6">
            <div className="relative">
                {(avatarPreview || currentUser?.avatar) && !isLoading ? (
                    <>
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                            <img
                                src={avatarPreview || getFullAvatarUrl(currentUser?.avatar)}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white border-2 border-slate-900 hover:bg-red-600 transition-colors"
                            title="Remove avatar"
                            disabled={isLoading}
                        >
                            <X size={12} />
                        </button>
                    </>
                ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-black text-white text-lg border border-white/10">
                        {isLoading ? '⏳' : userInitials}
                    </div>
                )}
                <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-0 right-0 p-1.5 bg-brand-teal rounded-full text-white cursor-pointer transition-all shadow-glow-teal ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-teal/80'
                        }`}
                    title="Upload avatar"
                >
                    <Camera size={12} />
                </label>
                <input
                    id="avatar-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                />
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Profile Avatar</span>
                <span className="text-[8px] text-muted uppercase tracking-widest">
                    Upload JPG, PNG, GIF, or WebP (max 5MB)
                </span>
            </div>
        </div>
    );
}
