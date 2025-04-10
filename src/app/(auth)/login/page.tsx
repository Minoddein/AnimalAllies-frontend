"use client";

import PasswordInput from "@/components/password-input";
import { Link } from "@heroui/link";
import { Input } from "@heroui/react";

export default function Page() {
    return (
        <main className="flex h-screen items-center justify-center">
            <div className="w-1/4">
                <p className="mx-2 my-4 text-center text-2xl">Вход в аккаунт</p>
                <form>
                    <div className="flex flex-col gap-4">
                        <Input label="Email" type="email" variant="bordered" />
                        <PasswordInput />
                    </div>
                </form>
                <div className="mx-2 my-4 flex justify-center">
                    <Link color="foreground" href="/registration">
                        Ещё нет аккаунта? Создать
                    </Link>
                </div>
            </div>
        </main>
    );
}
