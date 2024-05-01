"use client";

import styles from "../styles/Emoji.module.css";
import { useEffect, useState } from "react";

function Emoji({ emoji, x }) {
    return (
        <p
            className={styles.emoji_rain}
            style={{ left: x, animationDelay: `${Math.random() / 2}s` }}
        >
            {emoji}
        </p>
    );
}

export default function EmojiRain({ emojis, count }) {
    const [randomArray, setRandomArray] = useState([]);

    useEffect(() => {
        const randomizeArray = [];
        for (let i = 0; i < count; i++) {
            randomizeArray.push(emojis[Math.floor(Math.random() * emojis.length)]);
        }
        setRandomArray(randomizeArray);
    }, []);

    return Array.from({ length: count }, (_, i) => i).map((x, index) => (
        <Emoji emoji={randomArray[x]} x={`${(100 / count) * x}%`} key={index}></Emoji>
    ));
}
