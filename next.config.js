/** @type {import('next').NextConfig} */
require('dotenv').config()
const nextConfig = {
    reactStrictMode: true,
    env: {
        SYSTEM_NAME: process.env.SYSTEM_NAME,
        API_GROUP: process.env.API_GROUP,
        WS_API: process.env.WS_API,
        OPTIONS_STATUS: process.env.OPTIONS_STATUS,
        BASE_API: process.env.BASE_API,
        IMG_PREFIX: process.env.IMG_PREFIX,
        HOME_PAGE: process.env.HOME_PAGE,
    },
}

module.exports = nextConfig
