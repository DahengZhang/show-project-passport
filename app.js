const Koa = require('koa')
const Router = require('koa-router')
const axios = require('axios')
const app = new Koa()
const router = new Router()

const getArgv = (key) => {
    const booleanTmp = process.argv.find(item => {
        return new RegExp(`--${key}(?<!=)$`).test(item)
    })
    const valueTmp = process.argv.find(item => {
        return new RegExp(`--${key}=`).test(item)
    })

    if (booleanTmp) {
        return true
    } else if (valueTmp) {
        return valueTmp.match(new RegExp(`--${key}=([^ ]+)`)) && valueTmp.match(new RegExp(`--${key}=([^ ]+)`))[1] || ''
    } else {
        return false
    }
}

const oauth = {
    github: {
        client_id: '650943dbb3156daec5d1',
        client_secret: getArgv('secret'),
        redirect_uri: 'http://localhost:3000/oauth'
    }
}

router.get('/', async ctx => {
    const { s_url } = ctx.query
    ctx.redirect(`https://github.com/login/oauth/authorize?client_id=${oauth.github.client_id}&scope=user${s_url ? '&redirect_uri=' + oauth.github.redirect_uri + '?s_url=' + s_url : ''}`)
})

// localhost:3000/?s_url=123

router.get('/oauth', async ctx => {
    ctx.body = oauth.github.client_secret
})

router.get('/login', async ctx => {
    const { code } = ctx.query
    let resData
    try {
        const { data } = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: oauth.github.client_id,
            client_secret: oauth.github.client_secret,
            code
        }, {
            headers: {
                'Accept': 'application/json'
            }
        })
        resData = data
    } catch (error) {
        ctx.throw(500)
    }
    try {
        const { data } = await axios({
            method: 'GET',
            url: 'https://api.github.com/user',
            headers: {
                'Authorization': 'Bearer ' + resData.access_token
            }
        })
        resData = {
            uuid: data.id,
            name: data.name,
            email: data.email,
            avatar: data.avatar_url
        }
    } catch (error) {
        ctx.throw(500)
    }
    ctx.body = resData
})

app.use(router.routes())

app.listen(7000, _ => console.log('server is running...'))
