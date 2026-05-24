import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '@/theme/colors';

export default function HydrationDetailScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.85}
                >
                    <Ionicons name="chevron-back" size={28} color={colors.hydration} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Hydration</Text>
                    <Text style={styles.subtitle}>Daily goal: 2L</Text>
                </View>

                <View style={styles.centerContent}>
                    <Ionicons name="water-outline" size={48} color={colors.hydration} />
                    <Text style={styles.amountText}>1.2L / 2L</Text>
                    <Text style={styles.percentText}>60%</Text>
                </View>

                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>+250 ml</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>+500 ml</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>+750 ml</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>+1 L</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.logSection}>
                    <Text style={styles.logTitle}>Today&apos;s Log</Text>

                    <View style={styles.logItem}>
                        <Ionicons name="water-outline" size={22} color={colors.hydration} />
                        <Text style={styles.logText}>08:15 — 250 ml</Text>
                    </View>

                    <View style={styles.logItem}>
                        <Ionicons name="water-outline" size={22} color={colors.hydration} />
                        <Text style={styles.logText}>11:30 — 500 ml</Text>
                    </View>

                    <View style={styles.logItem}>
                        <Ionicons name="water-outline" size={22} color={colors.hydration} />
                        <Text style={styles.logText}>14:05 — 250 ml</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 24,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 56,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    centerContent: {
        alignItems: 'center',
        marginBottom: 64,
    },
    amountText: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
        marginTop: 20,
        marginBottom: 28,
    },
    percentText: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 16,
        marginBottom: 40,
    },
    actionButton: {
        width: '48%',
        backgroundColor: '#DCEBFF',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 26,
    },
    actionButtonText: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    logSection: {
        marginTop: 8,
    },
    logTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 18,
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    logText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
});