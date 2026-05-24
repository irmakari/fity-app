import React from 'react';
import { Text, View } from 'react-native';
import { workoutPlanPreviewCardStyles } from '@/components/onboarding/WorkoutPlanPreviewCard/WorkoutPlanPreviewCard.styles';
import { TWorkoutPlanPreviewCardProps } from '@/components/onboarding/WorkoutPlanPreviewCard/WorkoutPlanPreviewCard.type';

const WorkoutPlanPreviewCard = ({
    workoutDays,
}: TWorkoutPlanPreviewCardProps) => {
    return (
        <View style={workoutPlanPreviewCardStyles.card}>
            <View style={workoutPlanPreviewCardStyles.badge}>
                <Text style={workoutPlanPreviewCardStyles.badgeText}>
                    Weekly preview
                </Text>
            </View>

            {workoutDays.map((workoutDay, index) => (
                <View
                    key={workoutDay.id}
                    style={[
                        workoutPlanPreviewCardStyles.row,
                        index < workoutDays.length - 1 && workoutPlanPreviewCardStyles.rowBorder,
                    ]}
                >
                    <Text style={workoutPlanPreviewCardStyles.dayLabel}>
                        {workoutDay.dayLabel}
                    </Text>

                    <Text style={workoutPlanPreviewCardStyles.workoutLabel}>
                        {workoutDay.workoutLabel}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export default WorkoutPlanPreviewCard;
