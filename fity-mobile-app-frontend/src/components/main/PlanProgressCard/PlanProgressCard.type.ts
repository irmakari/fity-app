import { Ionicons } from '@expo/vector-icons';

export type TPlanProgressCardProps = {
    title: string;
    value: string;
    subtitle?: string;
    insight?: string;
    actionLabel?: string;
    progress: number;
    accentColor: string;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
};
