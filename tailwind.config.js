/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    green: "#5bc7b3",
                    red: "#a52b6e",
                    purple: "#5734e4",
                },
                // background
                dark: "#101321",
                light: "#1A1D2B",

                // shadow
                glow: "#db4bff7c",

                // border
                "border-light": "#34364C",
                "border-best": "#4DFFBF",

                // text
                "text-disabled": "#9D9D9D",

                // div
                "div-disabled": "#32343E",

                // unusual
                "text-route": "#4CFFBF",
                "border-route": "#25C189",
                "bg-route": "#134332",
            },

            fontSize: {
                "token-select": "24px",
            },

            keyframes: {
                "fade-in": {
                    "0%": {
                        opacity: 0,
                    },
                    "50%": {
                        opacity: 0,
                    },
                    "100%": {
                        opacity: 1,
                    },
                },
            },

            animation: {
                "fade-in": "fade-in 0.3s ease-in-out",
            },
        },
    },
    plugins: [],
};
