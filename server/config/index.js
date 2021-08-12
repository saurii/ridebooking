'use strict'

const config = {
    development: {
        storage: {
            main: {
                host: 'localhost',
                username: 'root',
                password: 'password',
                database: 'admin_cab',
                dbport: 3306
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
            projectsecretkey: '#36ad3vsys$%',
            apiendpoint: '/api/v1/'
        },
    },
    test: {},
    producttion: {
        storage: {
            main: {
                host: process.env.HOST,
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
                database: process.env.DATABASE,
                dbport: 3306
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