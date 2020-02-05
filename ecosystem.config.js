const { getArgv } = require('./config/util')

let args = []
getArgv('secret') && args.push(`--secret=${getArgv('secret')}`)
getArgv('password') && args.push(`--password=${getArgv('password')}`)
getArgv('account') && args.push(`--account=${getArgv('account')}`)
getArgv('database') && args.push(`--database=${getArgv('database')}`)
getArgv('collection') && args.push(`--collection=${getArgv('collection')}`)

module.exports = {
    apps: [{
        name: 'show-project-passport',
        script: `npm run start -- ${args.join(' ')}`,
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        }
    }]
}
