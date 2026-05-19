import { axiosInstance } from '@/services/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import {
    TExercise,
    TWorkoutPlan,
    TWorkoutPlanDetail,
    TWorkoutPlanExercise,
    TWorkoutExerciseStatus,
    TWorkoutSession,
    TWorkoutSessionSet,
    TStartWorkoutSessionPayload,
    TLogWorkoutSetPayload,
    TLogWorkoutExerciseStatusPayload,
    TFinishWorkoutSessionPayload,
} from './workout.type';

export class WorkoutService {
    static exercisesPath = API_ENDPOINTS.workout.exercises;
    static plansPath = API_ENDPOINTS.workout.workoutPlans;
    static planExercisesPath = API_ENDPOINTS.workout.workoutPlanExercises;
    static sessionsPath = API_ENDPOINTS.workout.workoutSessions;
    static sessionSetsPath = API_ENDPOINTS.workout.workoutSessionSets;
    static statusesPath = API_ENDPOINTS.workout.workoutExerciseStatuses;

    // ── Exercises ────────────────────────────────────────────────────────────

    static async getAllExercises(): Promise<TExercise[]> {
        // Real API: return (await axiosInstance.get('/exercises')).data.result;
        const response = await axiosInstance.get<TExercise[]>(this.exercisesPath);
        return response.data;
    }

    static async getExercisesByMuscleGroup(muscleGroup: string): Promise<TExercise[]> {
        // Real API: return (await axiosInstance.get(`/exercises?muscleGroup=${muscleGroup}`)).data.result;
        const response = await axiosInstance.get<TExercise[]>(
            `${this.exercisesPath}?muscleGroup=${encodeURIComponent(muscleGroup)}`
        );
        return response.data;
    }

    static async getExerciseById(id: number): Promise<TExercise> {
        // Real API: return (await axiosInstance.get(`/exercises/${id}`)).data.result;
        const response = await axiosInstance.get<TExercise>(`${this.exercisesPath}/${id}`);
        return response.data;
    }

    // ── Workout Plans ─────────────────────────────────────────────────────────

    static async getAllWorkoutPlans(): Promise<TWorkoutPlan[]> {
        // Real API: return (await axiosInstance.get('/workout-plans')).data.result;
        const response = await axiosInstance.get<TWorkoutPlan[]>(this.plansPath);
        return response.data;
    }

    static async getWorkoutPlanById(id: number, userId: number = 1): Promise<TWorkoutPlanDetail> {
        // Real API: return (await axiosInstance.get(`/workout-plans/${id}`)).data.result;
        const today = new Date().toISOString().split('T')[0];

        const [planRes, planExercisesRes, exercisesRes, statusesRes] = await Promise.all([
            axiosInstance.get<TWorkoutPlan>(`${this.plansPath}/${id}`),
            axiosInstance.get<TWorkoutPlanExercise[]>(
                `${this.planExercisesPath}?workoutPlanId=${id}`
            ),
            axiosInstance.get<TExercise[]>(this.exercisesPath),
            axiosInstance.get<TWorkoutExerciseStatus[]>(
                `${this.statusesPath}?workoutPlanId=${id}&userId=${userId}&date=${today}`
            ),
        ]);

        const plan = planRes.data;
        const planExercises = [...planExercisesRes.data].sort(
            (a, b) => a.orderIndex - b.orderIndex
        );
        const exercises = exercisesRes.data;
        const statuses = statusesRes.data;

        const exerciseDetails = planExercises.map((pe) => {
            const exercise = exercises.find((e) => Number(e.id) === Number(pe.exerciseId));
            const status = statuses.find((s) => Number(s.exerciseId) === Number(pe.exerciseId));
            return {
                id: Number(pe.exerciseId),
                name: exercise?.name ?? '',
                muscleGroup: exercise?.muscleGroup ?? '',
                sets: pe.sets,
                reps: pe.reps,
                restSeconds: pe.restSeconds,
                orderIndex: pe.orderIndex,
                isCompleted: status?.isCompleted ?? false,
                hasDiscomfort: status?.hasDiscomfort ?? false,
                statusId: status?.id,
            };
        });

        return { ...plan, exercises: exerciseDetails };
    }

    // ── Workout Sessions ──────────────────────────────────────────────────────

    static async startWorkoutSession(
        payload: TStartWorkoutSessionPayload
    ): Promise<TWorkoutSession> {
        // Real API: return (await axiosInstance.post('/workout-sessions/start', payload)).data.result;
        const response = await axiosInstance.post<TWorkoutSession>(this.sessionsPath, payload);
        return response.data;
    }

    static async getMyWorkoutSessions(userId: number): Promise<TWorkoutSession[]> {
        // Real API: return (await axiosInstance.get('/workout-sessions/my')).data.result;
        const response = await axiosInstance.get<TWorkoutSession[]>(
            `${this.sessionsPath}?userId=${userId}`
        );
        return response.data;
    }

    static async getWorkoutSessionById(id: number): Promise<TWorkoutSession> {
        // Real API: return (await axiosInstance.get(`/workout-sessions/${id}`)).data.result;
        const response = await axiosInstance.get<TWorkoutSession>(`${this.sessionsPath}/${id}`);
        return response.data;
    }

    static async finishWorkoutSession(
        sessionId: number,
        payload: TFinishWorkoutSessionPayload
    ): Promise<TWorkoutSession> {
        // Real API: return (await axiosInstance.patch(`/workout-sessions/${sessionId}/finish`, payload)).data.result;
        const response = await axiosInstance.patch<TWorkoutSession>(
            `${this.sessionsPath}/${sessionId}`,
            payload
        );
        return response.data;
    }

    static async cancelWorkoutSession(sessionId: number): Promise<TWorkoutSession> {
        // Real API: return (await axiosInstance.patch(`/workout-sessions/${sessionId}/cancel`)).data.result;
        const response = await axiosInstance.patch<TWorkoutSession>(
            `${this.sessionsPath}/${sessionId}`,
            { status: 'cancelled' }
        );
        return response.data;
    }

    // ── Workout Session Sets ──────────────────────────────────────────────────

    static async logWorkoutSet(payload: TLogWorkoutSetPayload): Promise<TWorkoutSessionSet> {
        // Real API: return (await axiosInstance.post('/workout-sessions/sets', payload)).data.result;
        const response = await axiosInstance.post<TWorkoutSessionSet>(
            this.sessionSetsPath,
            payload
        );
        return response.data;
    }

    static async getWorkoutSessionSets(sessionId: number): Promise<TWorkoutSessionSet[]> {
        // Real API: return (await axiosInstance.get(`/workout-sessions/${sessionId}/sets`)).data.result;
        const response = await axiosInstance.get<TWorkoutSessionSet[]>(
            `${this.sessionSetsPath}?sessionId=${sessionId}`
        );
        return response.data;
    }

    // ── Workout Exercise Statuses ─────────────────────────────────────────────

    static async logWorkoutExerciseStatus(
        payload: TLogWorkoutExerciseStatusPayload
    ): Promise<TWorkoutExerciseStatus> {
        // Real API: return (await axiosInstance.post('/workout-exercise-statuses', payload)).data.result;
        const response = await axiosInstance.post<TWorkoutExerciseStatus>(
            this.statusesPath,
            payload
        );
        return response.data;
    }

    static async getWorkoutExerciseStatuses(params: {
        userId?: number;
        workoutPlanId?: number;
        date?: string;
    }): Promise<TWorkoutExerciseStatus[]> {
        // Real API: return (await axiosInstance.get('/workout-exercise-statuses', { params })).data.result;
        const query = Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `${k}=${v}`)
            .join('&');
        const url = query ? `${this.statusesPath}?${query}` : this.statusesPath;
        const response = await axiosInstance.get<TWorkoutExerciseStatus[]>(url);
        return response.data;
    }

    static async updateWorkoutExerciseStatus(
        id: number,
        payload: Partial<TWorkoutExerciseStatus>
    ): Promise<TWorkoutExerciseStatus> {
        // Real API: return (await axiosInstance.patch(`/workout-exercise-statuses/${id}`, payload)).data.result;
        const response = await axiosInstance.patch<TWorkoutExerciseStatus>(
            `${this.statusesPath}/${id}`,
            payload
        );
        return response.data;
    }
}
