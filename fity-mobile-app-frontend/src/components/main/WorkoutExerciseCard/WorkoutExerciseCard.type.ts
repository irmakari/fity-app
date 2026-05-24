import { TWorkoutPlanExerciseDetail } from '@/collections/workout/workout.type';

export type TWorkoutExerciseCardProps = {
    exercise: TWorkoutPlanExerciseDetail;
    onToggleCompleted: () => void;
    onToggleDiscomfort: () => void;
};
