import { Ionicons } from '@expo/vector-icons';

export type TMultiSelectCardProps = {
    title: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    selected: boolean;
    onPress: () => void;
};
