import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PageEditor } from './components/editor/PageEditor';

export function router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PageEditor/>}>
                    
                </Route>
            </Routes>
        </BrowserRouter>
    )
}