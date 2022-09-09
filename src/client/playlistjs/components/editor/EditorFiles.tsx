import React from 'react';
import { Tree, GeistProvider } from '@geist-ui/react';
import './EditorFiles.scss';

export function EditorFiles() {
    return (
        <div className="editor-files">
            <GeistProvider themeType="dark">
                <Tree onClick={console.log} initialExpand>
                    <Tree.Folder name="src">
                        <Tree.Folder name="server">
                            <Tree.File name="server.ts"/>
                        </Tree.Folder>
                        <Tree.File name="package.json"/>
                    </Tree.Folder>
                </Tree>
            </GeistProvider>
        </div>
    )
}