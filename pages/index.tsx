import React from 'react';
import { HomeSignedIn } from ':/components/home/HomeSignedIn';
import { HomeSignedOut } from ':/components/home/HomeSignedOut';
import { useUser } from ':/hooks/useUser';

export default function PageHome() {
    const user = useUser();

    if(user) {
        return <HomeSignedIn/>;
    } else {
        return <HomeSignedOut/>;
    }
}