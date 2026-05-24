import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import HomeScreen from '../screens/main/HomeScreen/page';
import WorkoutHomeScreen from '../screens/main/WorkoutHomeScreen/page';
import NutritionScreen from '../screens/main/NutritionScreen/page';
import ProfileScreen from '@/screens/main/ProfileScreen/page';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: {
                    height: 72,
                    paddingTop: 8,
                    paddingBottom: 10,
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    if (route.name === 'Workout') iconName = focused ? 'barbell' : 'barbell-outline';
                    if (route.name === 'Nutrition') iconName = focused ? 'nutrition' : 'nutrition-outline';
                    if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

                    return <Ionicons name={iconName} size={size + 4} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Workout" component={WorkoutHomeScreen} />
            <Tab.Screen name="Nutrition" component={NutritionScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
