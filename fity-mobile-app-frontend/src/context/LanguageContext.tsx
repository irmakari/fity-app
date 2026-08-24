import React, { createContext, useState, useContext, ReactNode } from 'react';
import tr from '../../messages/tr.json';
import en from '../../messages/en.json';

export type SupportedLocale = 'tr' | 'en';

const translations: Record<SupportedLocale, any> = {
    tr,
    en,
};

interface LanguageContextType {
    locale: SupportedLocale;
    setLocale: (locale: SupportedLocale) => void;
    t: (keyPath: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState<SupportedLocale>('tr');

    const t = (keyPath: string, fallback?: string): string => {
        const keys = keyPath.split('.');
        let current: any = translations[locale];

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                current = undefined;
                break;
            }
        }

        if (typeof current === 'string') {
            return current;
        }

        return fallback || keyPath;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
