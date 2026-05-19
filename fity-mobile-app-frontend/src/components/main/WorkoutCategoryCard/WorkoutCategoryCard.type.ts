import { Ionicons } from '@expo/vector-icons';

export type TWorkoutCategoryCardProps = {
    name: string;
    exerciseCount: number;
    iconName: keyof typeof Ionicons.glyphMap;
    accentColor: string;
    onPress: () => void;
};
