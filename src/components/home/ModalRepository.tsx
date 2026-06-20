import React, { useState } from 'react';
import { Modals } from '../modal';
import { Modal } from '../Modal';
import { Alert, AlertDescription, AlertIcon, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { VscGitMerge } from 'react-icons/vsc';
import { attempt } from ':/util';

function withoutScheme(url: string) {
  const index = url.indexOf('://');
  if(index === -1) return url;
  return url.slice(index + 3);
}

export type ModalRepositoryResult = {
  repositoryUrl: string
  branch?: string
} | null;
export const ModalRepository = Modals.createModal<{ initialState?: ModalRepositoryResult; workspaceId: string }, ModalRepositoryResult>(({ modal, initialState, workspaceId }) => {
  const [value, setValue] = useState(initialState ? withoutScheme(initialState.repositoryUrl) : '');
  const [branch, setBranch] = useState(initialState ? initialState.branch : '');
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
    modal.resolve({
      repositoryUrl: value,
      branch: branch || undefined,
    });
  }

  return (
    <Modal onClose={close}>
      <Modal.Content>
        <Flex direction="column" gap={1}>
          {!initialState && (
            <Alert status="warning" mb={5}>
              <AlertIcon/>
              <AlertDescription>
                Please{' '}
                <a style={{ all: 'revert' }} href={`/api/workspaces/${workspaceId}/download-as-tar`} download>download your repository</a>
                {' '}before converting to Git.<br/>
                <b>Otherwise all your files will be lost!</b>
              </AlertDescription>
            </Alert>
          )}
          <FormControl isInvalid={!!error}>
            <FormLabel display="flex" alignItems="center" gap={1} pl={2}>
              <VscGitMerge size="1.5rem"/>
              Git repository URL
            </FormLabel>
            <InputGroup mt="2" fontFamily="mono">
              <InputLeftAddon fontSize="sm">
                {initialState?.repositoryUrl.startsWith('http://') ? 'http://' : 'https://'}
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
          <FormControl>
            <InputGroup mt="2" fontFamily="mono">
              <Input
                placeholder="main"
                htmlSize={42}
                fontFamily="mono"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </InputGroup>
          </FormControl>
        </Flex>
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