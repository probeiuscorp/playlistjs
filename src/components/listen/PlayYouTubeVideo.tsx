import React from 'react';
import { PlayableProps } from './Playable';
import YouTube from 'react-youtube';
import { getID } from ':/util/stable';

const fullHeight = { height: '100%' };

export type PlayableYouTubeVideo = {
    kind: 'youtube-video'
    id: string
    start?: number
    end?: number
};

export type PlayYouTubeVideoProps = PlayableProps & {
    video: PlayableYouTubeVideo
};
export function PlayYouTubeVideo({ video, onDone }: PlayYouTubeVideoProps) {
    return (
        <YouTube
            style={fullHeight}
            videoId={video.id}
            onEnd={onDone}
            opts={{
                playerVars: {
                    autoplay: 1,
                    start: video.start,
                    end: video.end,
                },
            }}
            key={getID(video)}
        />
    );
}