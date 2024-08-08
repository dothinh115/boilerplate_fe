module.exports = {
  apps: [
    {
      name: "truyenhot-cp",
      script: "./.output/server/index.mjs",
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
