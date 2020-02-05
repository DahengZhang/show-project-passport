const { getArgv } = require('./config/util')

module.exports = {
    apps: [{
        name: 'show-project-passport',
        script: `npm run start -- --secret=${getArgv('secret')} --password=${getArgv('password')} --account=${getArgv('account')} --database=${getArgv('database')} --collection=${getArgv('collection')}`,
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        }
    }]
}
