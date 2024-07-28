module.exports = {
  apps: [
    {
      name: "truyenhot-cp",
      script: "./.output/server/index.mjs",
      instances: 2,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
