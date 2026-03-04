import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileContextType {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Cargar perfil al iniciar
    useEffect(() => {
        try {
            const saved = localStorage.getItem('user_profile');
            if (saved) {
                setProfile(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }, []);

    // Guardar perfil cuando cambie
    const saveProfile = (newProfile: UserProfile | null) => {
        setProfile(newProfile);
        try {
            if (newProfile) {
                localStorage.setItem('user_profile', JSON.stringify(newProfile));
            } else {
                localStorage.removeItem('user_profile');
            }
        } catch (e) {
            console.error('Error saving profile:', e);
        }
    };

    return (
        <ProfileContext.Provider value={{ profile, setProfile: saveProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
