import { createContext, useContext, useState } from 'react';
import { ProfileDialog } from './ProfileDialog.jsx';

const ProfileContext = createContext(() => {});

export const useOpenProfile = () => useContext(ProfileContext);

export function ProfileProvider({ status, children }) {
    const [name, setName] = useState(null);
    return (
        <ProfileContext.Provider value={setName}>
            {children}
            <ProfileDialog status={status} name={name} onClose={() => setName(null)} />
        </ProfileContext.Provider>
    );
}
