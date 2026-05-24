import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './HydrationButtons.styles';

interface HydrationButtonsProps {
    onAdd: (amountMl: number) => void;
}

const HydrationButtons: React.FC<HydrationButtonsProps> = ({ onAdd }) => {
    const amounts = [
        { label: '+250 ml', value: 250 },
        { label: '+500 ml', value: 500 },
        { label: '+750 ml', value: 750 },
        { label: '+1 L', value: 1000 },
    ];

    return (
        <View style={styles.container}>
            {amounts.map((item) => (
                <TouchableOpacity 
                    key={item.value} 
                    style={styles.button}
                    onPress={() => onAdd(item.value)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>{item.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default HydrationButtons;
