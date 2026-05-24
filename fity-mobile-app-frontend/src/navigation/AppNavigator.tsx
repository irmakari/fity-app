import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuth } from '@/context/AuthContext';

export default function AppNavigator() {
    const { isAuthenticated } = useAuth();

    console.log('AppNavigator rendering... isAuthenticated is:', isAuthenticated);

    return (
        <NavigationIndependentTree>
            <NavigationContainer key={isAuthenticated ? 'authenticated' : 'guest'}>
                {isAuthenticated ? (
                    <MainNavigator />
                ) : (
                    <AuthNavigator />
                )}
            </NavigationContainer>
        </NavigationIndependentTree>
    );
}