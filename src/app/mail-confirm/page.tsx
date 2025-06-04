"use client";

import React from "react";

import { Icon } from "@iconify/react";

export default function MailConfirmPage() {
    return (
        <>
            <div className="min-h-[90vh] w-full content-center">
                <div className="flex justify-center">
                    <Icon icon="material-symbols:check" className="h-10 w-10 text-green-600" />
                    <p className="inline-block align-bottom text-2xl">
                        Регистрация прошла успешно! <br />
                        Можете закрыть эту страницу
                    </p>
                </div>
            </div>
        </>
    );
}
