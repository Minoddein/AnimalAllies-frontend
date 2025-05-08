"use client";

import * as React from "react";
import {useState} from "react";
import Header from "@/components/header";
import {Tab} from "@/types/tabs";

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>("animals");
    return (
        <main>
            <Header activeTab={activeTab} setActiveTabAction={setActiveTab}/>
        </main>
    );
}

