const { getArgv } = require('./util')

module.exports = {
    github: {
        client_id: '650943dbb3156daec5d1',
        client_secret: getArgv('secret'),
        redirect_uri: 'http://localhost:3000/oauth'
    }
}
