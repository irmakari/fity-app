import { TWorkoutPlan } from '@/collections/workout/workout.type';

export type TTodayWorkoutCardProps = {
    plan: TWorkoutPlan;
    onPress: () => void;
    onStartWorkout: () => void;
};
