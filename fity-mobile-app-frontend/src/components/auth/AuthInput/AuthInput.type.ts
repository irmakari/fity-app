import React from "react";

export type AuthInputProps = {
    value?: string;
    onChange?: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
    label?: string;
    type?: 'password' | 'email' | 'text';
    error?: boolean;
    disabled?: boolean;
    required?: boolean;
};