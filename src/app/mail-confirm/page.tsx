"use client";

import React from "react";

import { Icon } from "@iconify/react";

export default function MailConfirmPage() {
    return (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="max-w-lg rounded-xl bg-black/40 p-8 backdrop-blur-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
                    <Icon icon="material-symbols:check" className="h-10 w-10" />
                </div>
                <h1 className="mb-4 text-4xl font-bold">Регистрация прошла успешно!</h1>
                <p className="mb-8 text-xl">Можете закрыть эту страницу</p>
            </div>
        </div>
    );
}
