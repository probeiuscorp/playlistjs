import React from 'react';
import { useFetch } from ':/hooks/useFetch';
import { useUser } from ':/hooks/useUser';
import { WorkspaceData } from ':/models/Workspaces';
import { Button, Card, Editable, EditableInput, EditablePreview, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { MdHeadphones } from 'react-icons/md';
import { VscFolder, VscKebabVertical, VscTrash } from 'react-icons/vsc';
import { Page } from '../Page';

export function HomeSignedIn() {
    const user = useUser()!;
    const { data: workspaces, error, isLoading, mutate } = useFetch<WorkspaceData[]>('/api/workspaces');

    async function addWorkspace() {
        const workspace: WorkspaceData = await fetch('/api/workspaces', {
            method: 'POST',
        }).then((res) => res.json());

        mutate((last) => [
            ...(last ?? []),
            workspace,
        ]);
    }

    async function renameWorkspace(id: string, newName: string) {
        await fetch(`/api/workspaces/${id}/name`, {
            method: 'POST',
            body: JSON.stringify(newName),
        });

        mutate((last) => last?.filter((workspace) => workspace.id !== id) ?? []);
    }
    
    async function deleteWorkspace(id: string) {
        await fetch(`/api/workspaces/${id}`, {
            method: 'DELETE',
        });

        mutate((last) => last?.filter((workspace) => workspace.id !== id) ?? []);
    }

    return (
        <Page>
            <Flex m={4} gap={1} direction="column" alignItems="center">
                <Flex alignItems="center" gap={4}>
                    <Flex alignItems="center" flexDirection="column">
                        <Text color="gray.400">
                            You are logged in as
                        </Text>
                        <Text fontSize="lg">
                            {user}
                        </Text>
                    </Flex>
                    <Button onClick={() => signOut()}>
                        Log out
                    </Button>
                </Flex>
                
                <Flex mt={6} flexDirection="column" width="24em" gap={2}>
                    {workspaces?.length === 0
                        ? (
                            <Card alignItems="center" p={4} pl={8} pr={8} variant="outline">
                                <Text mb={2}>
                                    You don&apos;t have any workspaces.
                                </Text>
                                <Button colorScheme="purple" onClick={addWorkspace}>
                                    Make one?
                                </Button>
                            </Card>
                        )
                        : workspaces?.map((workspace) => (
                            <Card key={workspace.id} p={4} variant="outline" direction="row" alignItems="center" gap={2}>
                                <Editable flexGrow={1} defaultValue={workspace.name} onSubmit={(newName) => renameWorkspace(workspace.id, newName)}>
                                    <EditablePreview pl={2}/>
                                    <EditableInput pl={2} pr={2}/>
                                </Editable>
                                <IconButton aria-label="Listen" icon={<MdHeadphones/>} as="a" href={`/listen/${workspace.id}`}/>
                                <IconButton aria-label="Open" icon={<VscFolder/>} as="a" href={`/workspace/${workspace.id}`}/>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<VscKebabVertical/>}
                                    />
                                    <MenuList>
                                        <MenuItem icon={<VscTrash size="1.5em"/>} onClick={() => deleteWorkspace(workspace.id)}>
                                            Delete
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Card>
                        ))}
                    {!!workspaces?.length && (
                        <Button onClick={addWorkspace} alignSelf="center">
                            Create Workspace
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Page>
    );
}