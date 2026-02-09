/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                gradient: 'gradient 8s linear infinite',
                float: 'float 6s ease-in-out infinite',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': {
                        backgroundSize: '200% 200%',
                        backgroundPosition: 'left center',
                    },
                    '50%': {
                        backgroundSize: '200% 200%',
                        backgroundPosition: 'right center',
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
}
