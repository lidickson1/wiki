import "bulma/css/bulma.min.css";
import "bulma-prefers-dark/css/bulma-prefers-dark.css";
import "@creativebulma/bulma-divider/dist/bulma-divider.min.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/main.css";

import { getPeople } from "@/components/lib";

import Navigation from "@/components/Navigation";
// import Head from "next/head";

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}) {
    const people = getPeople();

    return (
        <html lang="en">
            <body>
                <div
                    //https://stackoverflow.com/a/51410022
                    style={{
                        display: "flex",
                        minHeight: "100vh",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div style={{ width: "100%" }}>
                        <div className="container">
                            <Navigation people={people} />
                        </div>
                        {children}
                    </div>
                    <footer className="footer py-5" style={{ width: "100%" }}>
                        <div className="content has-text-centered">
                            <p style={{ fontSize: "0.9rem" }}>
                                Built by Dickson Li with Javascript,{" "}
                                <a href="https://react.dev/">React</a>,{" "}
                                <a href="https://nextjs.org/">Next.js</a>,{" "}
                                <a href="https://bulma.io/">Bulma</a>. See my other projects{" "}
                                <a href="https://lidickson1-portfolio.vercel.app/">here</a> and
                                visit my <a href="https://github.com/lidickson1">GitHub</a>
                            </p>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
}

export const metadata = {
    title: "Wiki Demo",
    description: "Wiki Demo by Dickson Li",
};
