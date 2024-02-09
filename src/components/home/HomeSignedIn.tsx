import React from 'react';
import { useFetch } from ':/hooks/useFetch';
import { WorkspaceData, WorkspaceVisibility } from ':/models/Workspaces';
import { Button, Card, Editable, EditableInput, EditablePreview, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { MdHeadphones } from 'react-icons/md';
import { VscFolder, VscKebabVertical, VscLock, VscTrash, VscUnlock } from 'react-icons/vsc';
import { Page } from '../Page';

export type HomeSignedInProps = {
    user: string
    initialWorkspaces: WorkspaceData[] | null
}
export function HomeSignedIn({ user, initialWorkspaces }: HomeSignedInProps) {
    const showToast = useToast();
    const { data: loadedWorkspaces, mutate } = useFetch<WorkspaceData[]>('/api/workspaces');
    const workspaces = loadedWorkspaces ?? initialWorkspaces;

    async function addWorkspace() {
        const workspace: WorkspaceData = await fetch('/api/workspaces', {
            method: 'POST',
        }).then((res) => res.json());

        mutate((last) => [
            ...(last ?? []),
            workspace,
        ]);
    }
    
    async function deleteWorkspace(id: string) {
        await fetch(`/api/workspaces/${id}`, {
            method: 'DELETE',
        });

        mutate((last) => last?.filter((workspace) => workspace.id !== id) ?? []);
    }

    const modifyWorkspace = (id: string, modify: (workspace: WorkspaceData) => WorkspaceData) => mutate((last) => last?.map((workspace) => {
        return workspace.id === id ? modify(workspace) : workspace;
    }));
    async function renameWorkspace(id: string, name: string) {
        await fetch(`/api/workspaces/${id}/name`, {
            method: 'POST',
            body: JSON.stringify(name),
        });

        modifyWorkspace(id, (workspace) => ({ ...workspace, name }));
    }

    async function setWorkspaceVisibility(id: string, visibility: WorkspaceVisibility) {
        modifyWorkspace(id, (workspace) => ({ ...workspace, visibility }));
        await fetch(`/api/workspaces/${id}/visibility`, {
            method: 'POST',
            body: JSON.stringify(visibility),
        });
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
                                <Editable
                                    flexGrow={1}
                                    defaultValue={workspace.name}
                                    onSubmit={(newName) => {
                                        if(workspace.name !== newName) {
                                            renameWorkspace(workspace.id, newName);
                                        }
                                    }}
                                >
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
                                        {workspace.visibility === 'public' ? (
                                            <MenuItem icon={<VscLock size="1.5em"/>} onClick={() => {
                                                setWorkspaceVisibility(workspace.id, 'private');
                                                showToast({
                                                    title: `${workspace.name} is now private`,
                                                    description: 'Only you, logged in, can listen',
                                                    status: 'info',
                                                    duration: 10e3,
                                                    isClosable: true,
                                                });
                                            }}>
                                                Make private
                                            </MenuItem>
                                        ) : (
                                            <MenuItem icon={<VscUnlock size="1.5em"/>} onClick={() => {
                                                setWorkspaceVisibility(workspace.id, 'public');
                                                showToast({
                                                    title: `${workspace.name} is now public`,
                                                    description: 'Anyone with a link can listen and see the compiled source',
                                                    status: 'info',
                                                    duration: 10e3,
                                                    isClosable: true,
                                                });
                                            }}>
                                                Make public
                                            </MenuItem>
                                        )}
                                    </MenuList>
                                </Menu>
                            </Card>
                        ))}
                    {!!workspaces?.length && (
                        <Button onClick={addWorkspace} alignSelf="center">
                            Create New Workspace
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Page>
    );
}