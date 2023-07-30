import React from 'react';
import { Page } from '../Page';
import { Button, ButtonGroup, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { VscGithub } from 'react-icons/vsc';
import { Code } from './Code';

const code = `\
// Create a playlist of one song
const neverGonnaGiveYouUp = 'dQw4w9WgXcQ';
Playlist.yield([neverGonnaGiveYouUp]);

// Loop forever
Playlist.yield(function*() {
    while(true) {
        yield neverGonnaGiveYouUp;
    }
});
`;

export function HomeSignedOut() {
    return (
        <Page title="playlistjs">
            <Flex direction="column" alignItems="center">
                <VStack mt={8} mb={4}>
                    <Heading fontFamily="GT Pressura Mono">
                        playlistjs
                    </Heading>
                    <Text color="gray.300" fontSize="xl">
                        because lists are boring
                    </Text>
                </VStack>
                <ButtonGroup spacing={2} size="lg">
                    <Button colorScheme="teal" onClick={() => signIn()}>
                        Sign in|up
                    </Button>
                    <Button
                        leftIcon={<VscGithub size="1.5em"/>}
                        as='a'
                        href='https://github.com/probeiuscorp/playlistjs'
                        target="__blank"
                    >
                        GitHub
                    </Button>
                </ButtonGroup>
            </Flex>

            <Flex direction="column" width="42em" ml="auto" mr="auto" mt="2em">
                <Code code={code}/>
            </Flex>
        </Page>
    );
}