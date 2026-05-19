export type LoginRequestParams = {
    email: string;
    password: string;
};

export type User = {
    id: number;
    email: string;
    password: string;
    fullName: string;
};