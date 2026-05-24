export type THydrationGoalResponse = {
    id: number;
    userId: number;
    dailyGoalMl: number;
    updatedAt: string;
};

export type THydrationLogBody = {
    userId: number;
    amountMl: number;
    loggedAt: string;
    note?: string;
};

export type THydrationLogResponse = {
    id: number;
    userId: number;
    amountMl: number;
    loggedAt: string;
    note?: string;
};