module.exports = {
  apps: [
    {
      name: "juicewrld-bot",
      script: "./index.js",
      restart_delay: 5000,
      max_restarts: 10,
      exp_backoff_restart_delay: 2000,
    },
  ],
};
