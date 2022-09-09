import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './router';
import './playlistjs.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(router());