import { Ionicons } from '@expo/vector-icons';

export type TSelectableCardProps = {
    title: string;
    description?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    selected: boolean;
    onPress: () => void;
    compact?: boolean;
};
