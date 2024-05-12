import React, { useState } from 'react';
import { Modals } from '../modal';
import { Modal } from '../Modal';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { VscGitMerge } from 'react-icons/vsc';
import { attempt } from ':/util';

function withoutScheme(url: string) {
    const index = url.indexOf('://');
    if(index === -1) return url;
    return url.slice(index + 3);
}

export const ModalRepository = Modals.createModal<{ currentURL?: string }, string | null>(({ modal, currentURL }) => {
    const [value, setValue] = useState(currentURL ? withoutScheme(currentURL) : '');
    const [error, setError] = useState('');
    const close = () => modal.resolve(null);

    function submit() {
        let forgivingURL = value;
        if(!/^https?:\/\//.test(forgivingURL)) {
            forgivingURL = 'https://' + forgivingURL;
        }
        const [url] = attempt(() => new URL(forgivingURL).toString());
        if(!url) return void setError('Invalid URL');

        setError('');
        modal.resolve(url);
    }

    return (
        <Modal onClose={close}>
            <Modal.Content>
                <FormControl isInvalid={!!error}>
                    <FormLabel display="flex" alignItems="center" gap={1} pl={2}>
                        <VscGitMerge size="1.5rem"/>
                        Git repository URL
                    </FormLabel>
                    <InputGroup mt="2" fontFamily="mono">
                        <InputLeftAddon fontSize="sm">
                            {currentURL?.startsWith('http://') ? 'http://' : 'https://'}
                        </InputLeftAddon>
                        <Input
                            autoFocus
                            htmlSize={42}
                            fontFamily="mono"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </InputGroup>
                    {!!error && (
                        <FormErrorMessage>
                            {error}
                        </FormErrorMessage>
                    )}
                </FormControl>
            </Modal.Content>
            <Modal.Buttons>
                <Button colorScheme="purple" onClick={submit}>
                    OK
                </Button>
                <Button onClick={close}>
                    Cancel
                </Button>
            </Modal.Buttons>
        </Modal>
    );
});