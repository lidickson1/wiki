"use client";

import { createContext, useState } from "react";

const Context = createContext({});
export default Context;

export function Provider({ children, sections, latestSection }) {
    const [collapsed, setCollapsed] = useState(
        Object.fromEntries(sections.map((x) => [x, x !== latestSection]))
    );

    return <Context.Provider value={{ collapsed, setCollapsed }}>{children}</Context.Provider>;
}
