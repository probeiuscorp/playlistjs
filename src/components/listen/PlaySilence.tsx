import React, { useEffect } from 'react';
import { PlayableProps } from './Playable';
import { useReffed } from ':/hooks/useReffed';
import { Center } from '@chakra-ui/react';
import { stable } from ':/util/stable';
import { Atom, atom, useAtomValue } from 'jotai';

export type PlayableSilence = {
    kind: 'silence'
    duration: number
};

function formatRoundedDuration(seconds: number) {
    if(seconds < 60) {
        return `${Math.ceil(seconds)}s`;
    } else {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${Math.floor(seconds % 60)}s`;
    }
}

const getCountdownAtom = stable((silence: PlayableSilence) => {
    const duration = silence.duration;
    const start = Date.now();

    const countdownAtom = atom(duration);
    countdownAtom.onMount = (setAtom) => {
        const handle = setInterval(() => {
            const timeLeft = duration - (Date.now() - start);
            if(timeLeft <= 0) {
                clearInterval(handle);
                setAtom(0);
            } else {
                setAtom(timeLeft);
            }
        }, 150);
        return () => clearInterval(handle);
    };
    return countdownAtom;
});
const getRoundedDurationAtom = stable((countdownAtom: Atom<number>) => {
    return atom((get) => {
        const countdown = get(countdownAtom);
        return formatRoundedDuration(countdown / 1e3);
    });
});

export type PlaySilenceProps = PlayableProps & {
    silence: PlayableSilence
};
export function PlaySilence({ silence, onDone }: PlaySilenceProps) {
    const countdownAtom = getCountdownAtom(silence);
    const roundedDurationAtom = getRoundedDurationAtom(countdownAtom);
    const countdown = useAtomValue(roundedDurationAtom);
    const currentOnDone = useReffed(onDone);
    useEffect(() => {
        const timeout = setTimeout(() => {
            currentOnDone.current();
        }, silence.duration);
        return () => clearTimeout(timeout);
    }, [silence]);

    return (
        <Center fontSize="4xl" h="full" bg="gray.700" rounded="md" flexDirection="column" >
            {countdown}
        </Center>
    );
}