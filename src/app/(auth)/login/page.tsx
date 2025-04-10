"use client";

import PasswordInput from "@/components/password-input";
import { Input } from "@heroui/react";

export default function Page() {
    return (
        <main>
            <form>
                <div className="flex w-full flex-col gap-4">
                    <Input label="Email" type="email" variant="bordered" />
                    <PasswordInput />
                </div>
            </form>
        </main>
    );
}
