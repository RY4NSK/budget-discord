import React from 'react';

export interface UserData {
    nickname: string;
    status: string;
    timezone?: string;
}

export const UserDataContext = React.createContext<UserData>({nickname:"if you're seeing this its a bug", status: "theres a bug", timezone: "spiders"});
