import React from 'react';
import { PlaySilence, PlayableSilence } from './PlaySilence';
import { PlayYouTubeVideo, PlayableYouTubeVideo } from './PlayYouTubeVideo';

export type Playable = PlayableYouTubeVideo | PlayableSilence;
export type PlayableProps = {
    onDone(): void
};

export type PlayProps = PlayableProps & {
    playable: Playable
};
export function Play({ playable, onDone }: PlayProps) {
    if(playable.kind === 'youtube-video') {
        return (
            <PlayYouTubeVideo
                video={playable}
                onDone={onDone}
            />
        );
    } else if(playable.kind === 'silence') {
        return (
            <PlaySilence
                silence={playable}
                onDone={onDone}
            />
        );
    } else throw new Error(`Unknown playable kind "${(playable as Playable).kind}"`);
}