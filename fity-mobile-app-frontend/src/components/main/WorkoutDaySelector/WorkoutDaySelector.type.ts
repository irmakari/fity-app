export type TWorkoutDay = {
    label: string;
    date: number;
};

export type TWorkoutDaySelectorProps = {
    days: TWorkoutDay[];
    activeDayIndex: number;
    onSelect: (index: number) => void;
};
