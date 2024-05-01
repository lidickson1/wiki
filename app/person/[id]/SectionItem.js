"use client";

import { useContext } from "react";
import Context from "./provider";

export default function SectionItem({ section, name }) {
    const { collapsed, setCollapsed } = useContext(Context);

    return (
        <li key={section}>
            <a
                href={`#${section}`}
                onClick={() =>
                    setCollapsed({
                        ...collapsed,
                        [section]: false, //always uncollapse the section if we clicked
                    })
                }
            >
                {name}
            </a>
        </li>
    );
}
