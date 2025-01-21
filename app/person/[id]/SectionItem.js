"use client";

import { useContext } from "react";
import Context from "./provider";
import { useRouter } from "next/navigation";

export default function SectionItem({ section, name }) {
    const { collapsed, setCollapsed } = useContext(Context);
    const router = useRouter();

    return (
        <li key={section}>
            <a
                href={`#${section}`}
                onClick={() => {
                    setCollapsed({
                        ...collapsed,
                        [section]: false, //always uncollapse the section if we clicked
                    });
                    router.replace(`#${section}`); //this is needed, otherwise back button wouldn't work
                }}
            >
                {name}
            </a>
        </li>
    );
}
