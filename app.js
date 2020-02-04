const Koa = require('koa')
const Router = require('koa-router')
const axios = require('axios')
const app = new Koa()
const router = new Router()

const connection = require('./dao/mysql')
const { github } = require('./config/config')
const { findUserById, insertUser, updateUser } = require('./dao/user')

connection.connect((err) => {
    if (err) {
        console.error(`Connection Mysql on ${err}`)
        return
    }
    console.log(`Connection Mysql success!`)
})

router.get('/', async ctx => {
    const { s_url } = ctx.query
    ctx.redirect(`https://github.com/login/oauth/authorize?client_id=${github.client_id}&scope=user${s_url ? '&redirect_uri=' + github.redirect_uri + '?s_url=' + s_url : ''}`)
})

// localhost:3000/?s_url=123

router.get('/login', async ctx => {
    const { code } = ctx.query
    try {
        const res = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: oauth.github.client_id,
            client_secret: oauth.github.client_secret,
            code
        }, {
            headers: {
                'Accept': 'application/json'
            }
        })
        const { data } = await axios.get('https://api.github.com/user', null, {
            headers: {
                'Authorization': 'Bearer ' + res.data.access_token
            }
        })
        const has = await findUserById(data.id)
        const info = {
            uuid: data.id,
            name: data.name,
            email: data.email,
            avatar: data.avatar
        }
        ctx.body = {
            code: 200,
            data: has ? await updateUser(info) : await insertUser(info)
        }
    } catch (error) {
        ctx.throw(500)
    }
})

app.use(router.routes())

app.listen(7000, _ => console.log('server is running...'))
