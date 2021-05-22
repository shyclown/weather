
const config = require(`./config.${process.env.REACT_APP_ENV || 'local'}.json`);

export default {
    // default
    API_ROOT: "http://localhost:3001",
    APP_NAME: "FRONTEND TEST ",
    APP_VERSION: process.env.REACT_APP_VERSION,
    DEFAULT_LOCALE: "us",

    ...config,

    paths: {
        // ...paths,
        ...config.paths
    },

    locales: {
        // ...locales,
        ...config.locales
    }
};