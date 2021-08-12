'use strict'

const config = {
    development: {
        storage: {
            main: {
                host: 'localhost',
                username: 'root',
                password: 'password',
                database: 'admin_cab',
                dialect: "mysql",
                collate: "utf8_general_ci",
                pool: {
                    max: 10,
                    min: 0,
                    idle: 10000,
                    evict: 1000,
                    acquire: 30000,
                    handleDisconnects: true
                },
                retry: true
            }
        },
        server: {
            connections: {
                port: 9191,
                routes: {
                    cors: '*'
                }
            }
        },
        internals: {
            randomkeylength: 3,
            secretuserrandomstringlength: 2,
            tokenrandomcharlength: 3,
            projectsecretkey: '#128ridevsys$%',
            apiendpoint: '/api/v1/'
        }
    },
    test: {},
    producttion: {
        storage: {
            main: {
                host: process.env.HOST,
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
                database: process.env.DATABASE,
                dialect: "mysql",
                collate: "utf8_general_ci",
            }
        },
        server: {
            connections: {
                port: process.env.PORT,
                routes: {
                    cors: process.env.CORS,
                }
            }
        },
        internals: {
            randomkeylength: process.env.RANDOMKEYLENGTH || 3,
            secretuserrandomstringlength: process.env.SECRETUSERRANDOMSTRINGLENGTH || 2,
            tokenrandomcharlength: process.env.TOKENRANDOMCHARLENGTH || 3,
            projectsecretkey: process.env.PROJECTSECRETKEY
        }
    }
}

let env = process.env.NODE_ENV || "development";

exports._config = config[env];