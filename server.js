const _config = require('./server/config/index')._config;
const app = require('./app');
const numCPUs = require('os').cpus().length;
const cluster = require('cluster');

if (cluster.isMaster && 'production' === process.env.NODE_ENV) {
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {

    });
    cluster.on('exit', (worker) => {
        cluster.fork();
    });
} else {
    app
        .listen(_config.server.connections.port, () => {
            console.log(`server listening on port ${_config.server.connections.port}`)
        })
        .on('error', (e) => logger.error(e));
}