module.exports = {
  apps: [
    {
      name: "CP",
      script: "./.output/server/index.mjs",
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
