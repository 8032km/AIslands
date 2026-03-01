"use client";
import { I18nProvider } from "@/i18n/useTranslation";

export default function Providers({ children }) {
    return (
        <I18nProvider>{children}</I18nProvider>
    );
}
