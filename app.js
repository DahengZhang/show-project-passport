const Koa = require('koa')
const Router = require('koa-router')
const error = require('koa-json-error')
const axios = require('axios')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = new Koa()
const router = new Router()

const { getArgv } = require('./config/util')
const { github } = require('./config/config')
const isDev = process.env.NODE_ENV === 'development'

mongoose.connect(`mongodb://${getArgv('account') || getArgv('collection') || 'show'}:${getArgv('password')}@${getArgv('database') || 'localhost'}/${getArgv('collection') || 'show'}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => console.log('mongodb link success!'))
mongoose.connection.on('error', console.error)

const userSchema = mongoose.model('users', new mongoose.Schema({
    __v: {
        type: Number,
        select: false
    },
    id: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
}))

router.get('/', async ctx => {
    const { s_url } = ctx.query
    ctx.redirect(`https://github.com/login/oauth/authorize?client_id=${github.client_id}&scope=user${s_url ? '&redirect_uri=' + github.redirect_uri + '?s_url=' + s_url : ''}`)
})

// localhost:3000/?s_url=123

router.get('/login', async ctx => {
    const { code } = ctx.query
    const res = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: github.client_id,
        client_secret: github.client_secret,
        code
    }, {
        headers: {
            'Accept': 'application/json'
        }
    })
    if (res.data.error) {
        ctx.throw(400, res.data.error_description)
    }
    const { data } = await axios.get('https://api.github.com/user', {
        headers: {
            'Authorization': `${res.data.token_type} ${res.data.access_token}`
        }
    })
    const tmp = await userSchema.findOneAndUpdate({
        id: data.id
    }, {
        email: data.email,
        name: data.name,
        avatar: data.avatar_url
    }, { new: true, upsert: true }).select('-email -_id -id')
    ctx.body = {
        ...tmp.toObject(),
        token: jwt.sign({ id: tmp.id }, getArgv('secret'), { expiresIn: '8h' })
    }
})

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    await next()
})
app.use(error({
    postFormat: (_, { stack, ...rest }) => isDev ? { stack, ...rest } : rest
}))

app.use(router.routes())

app.listen(7000, _ => console.log('server is running...'))
