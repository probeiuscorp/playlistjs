import React from 'react';

export type YouTubeThumbnailProps = {
    video: string
}
export function YouTubeThumbnail({ video }: YouTubeThumbnailProps) {
    return (
        <img
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            src={`https://img.youtube.com/vi/${video}/0.jpg`}
        />
    );
}