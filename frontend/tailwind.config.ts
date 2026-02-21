// import type { Config } from 'tailwindcss'

// const config: Config = {
//     content: [
//         './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//         './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//         './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//     ],
//     theme: {
//         extend: {
//             fontFamily: {
//                 sans: ['"General Sans"', 'system-ui', 'sans-serif'],
//                 serif: ['"Playfair Display"', 'Georgia', 'serif'],
//             },
//             colors: {
//                 themeYellow: '#FDE260',
//                 themeGreen: '#71FE11',
//                 themeBlue: '#B5C9DE',
//                 themeDark: '#171717',
//             },
//         },
//     },
//     plugins: [],
// }
// export default config
//  config

import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            },
            colors: {
                themeDark: '#1E1E1E',
            }
        },
    },
    plugins: [],
}
export default config