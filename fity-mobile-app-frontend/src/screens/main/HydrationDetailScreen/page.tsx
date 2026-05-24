import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors, typography } from '@/theme';
import { HydrationService } from '@/collections/hydration/hydration.service';
import { THydrationLogResponse, THydrationGoalResponse } from '@/collections/hydration/hydration.type';
import { HydrationButtons } from '@/components/main/HydrationButtons';
import { useAuth } from '@/context/AuthContext';

const HydrationDetailScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const userId = Number(user?.id) || 1;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [goal, setGoal] = useState<THydrationGoalResponse | null>(null);
    const [logs, setLogs] = useState<THydrationLogResponse[]>([]);
    const [newLogs, setNewLogs] = useState<any[]>([]);
    const [currentIntake, setCurrentIntake] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('Fetching hydration data for userId:', userId);
            const [goalData, logsData] = await Promise.all([
                HydrationService.getGoal(userId),
                HydrationService.getLogs(userId)
            ]);

            console.log('Hydration goal received:', goalData);
            console.log('Hydration logs received:', logsData);

            setGoal(goalData);
            setLogs(logsData);
            
            const total = logsData.reduce((acc, log) => acc + log.amountMl, 0);
            setCurrentIntake(total);
            console.log('Current intake calculated:', total);
        } catch (error) {
            console.error('Error fetching hydration data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddWater = (amountMl: number) => {
        console.log('Adding water log locally:', amountMl, 'ml');
        const tempId = Date.now().toString();
        const newEntry = {
            id: tempId,
            userId,
            amountMl,
            loggedAt: new Date().toISOString(),
            isNew: true
        };

        setNewLogs(prev => [newEntry, ...prev]);
        setCurrentIntake(prev => prev + amountMl);
    };

    const handleSave = async () => {
        if (newLogs.length === 0) return;

        try {
            setSaving(true);
            console.log('Saving', newLogs.length, 'new logs...');
            
            // Send each log to the server
            // Since json-server doesn't support bulk, we do it sequentially or in parallel
            await Promise.all(newLogs.map(log => 
                HydrationService.addLog({
                    userId: log.userId,
                    amountMl: log.amountMl,
                    loggedAt: log.loggedAt
                })
            ));

            console.log('All logs saved successfully');
            setNewLogs([]);
            fetchData(); // Refresh everything
        } catch (error) {
            console.error('Error saving water logs:', error);
            alert('Could not save logs. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const dailyGoalMl = goal?.dailyGoalMl || 2000;
    const progress = Math.min(currentIntake / dailyGoalMl, 1);
    const percentage = Math.round(progress * 100);
    const remainingMl = Math.max(dailyGoalMl - currentIntake, 0);

    const allLogs = [...newLogs, ...logs];

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryButton} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Hydration</Text>
                        <Text style={styles.headerSubtitle}>Daily goal: {dailyGoalMl / 1000}L</Text>
                    </View>
                    <View style={{ width: 40 }} /> 
                </View>

                <View style={styles.content}>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryIconWrapper}>
                            <Ionicons name="water" size={32} color="#60A5FA" />
                        </View>

                        <Text style={styles.mainValue}>
                            {currentIntake / 1000}L / {dailyGoalMl / 1000}L
                        </Text>

                        <Text style={styles.percentageText}>{percentage}% completed today</Text>

                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${progress * 100}%` },
                                ]}
                            />
                        </View>

                        <View style={styles.trackingGrid}>
                            <View style={styles.trackingCard}>
                                <Text style={styles.trackingValue}>{allLogs.length}</Text>
                                <Text style={styles.trackingLabel}>Logs today</Text>
                            </View>

                            <View style={styles.trackingCard}>
                                <Text style={styles.trackingValue}>
                                    {(remainingMl / 1000).toFixed(1)}L
                                </Text>
                                <Text style={styles.trackingLabel}>Remaining</Text>
                            </View>
                        </View>
                    </View>

                    <HydrationButtons onAdd={handleAddWater} />

                    <View style={styles.logsSection}>
                        <Text style={styles.logsTitle}>Daily Tracking</Text>
                        {allLogs.map((log) => (
                            <View key={log.id} style={styles.logItem}>
                                <View
                                    style={[
                                        styles.logIconWrapper,
                                        log.isNew && styles.logIconWrapperActive,
                                    ]}
                                >
                                    <Ionicons 
                                        name="water-outline" 
                                        size={20} 
                                        color={log.isNew ? colors.primaryButton : "#60A5FA"} 
                                    />
                                </View>

                                <View style={styles.logTextWrapper}>
                                    <Text style={[styles.logText, log.isNew && { color: colors.primaryButton }]}>
                                        {log.amountMl >= 1000 ? `${log.amountMl / 1000} L` : `${log.amountMl} ml`}
                                    </Text>
                                    <Text style={styles.logTimeText}>
                                        {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {log.isNew ? ' • waiting to save' : ''}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        {allLogs.length === 0 && (
                            <Text style={styles.emptyLogsText}>No water logged today yet.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {newLogs.length > 0 && (
                <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Ionicons name="save-outline" size={20} color="#FFF" />
                            <Text style={styles.saveButtonText}>Save ({newLogs.length})</Text>
                        </>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingTop: 64,
        paddingBottom: 40,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
    },
    headerSubtitle: {
        ...typography.input,
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    content: {
        paddingHorizontal: 16,
        gap: 16,
    },
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 3,
        alignItems: 'center',
    },
    summaryIconWrapper: {
        width: 74,
        height: 74,
        borderRadius: 24,
        backgroundColor: '#EAF3FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    mainValue: {
        ...typography.title,
        fontSize: 32,
        lineHeight: 40,
        color: colors.textPrimary,
    },
    percentageText: {
        ...typography.input,
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 8,
        marginBottom: 16,
    },
    progressTrack: {
        width: '100%',
        height: 10,
        borderRadius: 999,
        backgroundColor: '#E7EDF3',
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: '#60A5FA',
    },
    trackingGrid: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    trackingCard: {
        flex: 1,
        backgroundColor: colors.surfaceMuted,
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
    },
    trackingValue: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    trackingLabel: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textSecondary,
    },
    logsSection: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    logsTitle: {
        ...typography.label,
        fontSize: 18,
        color: colors.textPrimary,
        marginBottom: 16,
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    logIconWrapper: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#EAF3FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    logIconWrapperActive: {
        backgroundColor: colors.surfaceTint,
    },
    logTextWrapper: {
        flex: 1,
    },
    logText: {
        ...typography.label,
        fontSize: 15,
        color: colors.textPrimary,
    },
    logTimeText: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    emptyLogsText: {
        ...typography.input,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 10,
    },
    saveButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: colors.primaryButton,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 18,
        elevation: 5,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    saveButtonText: {
        color: '#FFF',
        ...typography.button,
        marginLeft: 8,
    },
});

export default HydrationDetailScreen;
