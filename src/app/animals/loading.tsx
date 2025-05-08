"use client";

import {CircularProgress} from "@heroui/react";

export default function Loading() {
    return (
        <div className="flex h-screen items-center justify-center">
            <CircularProgress aria-label="Loading..."/>
        </div>
    );
}