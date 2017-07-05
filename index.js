const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const fetch = require('node-fetch');

const config = require('./config');
const supportedCurrencies = require('./supported-currency.json')

const app = new Koa();

const router = new Router();

app.use(bodyParser());

app.use(logger());

app.use(router.routes());

app.listen(8100);

router.get('/', async function (ctx) {
    ctx.body = 'Currency Rate Server';
});

// -----------------------------------
// Query parameter:
// 1. currency
// 2. reference
// 3. amount
//
// Example:
// http://localhost:8100/rates?currency=HKD&reference=CNY&amount=10000
// -----------------------------------
router.get('/rates', async function (ctx) {

    if (!ctx.query.amount || ctx.query.amount < 0) {
        ctx.throw(400);
    }

    if (!supportedCurrencies[ctx.query.currency]) {
        ctx.throw(400);
    }
    const currency = ctx.query.currency;

    if (ctx.query.reference && !supportedCurrencies[ctx.query.reference]) {
        ctx.throw(400);
    }
    const reference = !ctx.query.reference ? 'USD' : ctx.query.reference;
    const currencies = currency + ',' + reference

    let res = await fetch(`http://apilayer.net/api/live?access_key=${config.apiConfig.accessKey}&currencies=${currencies}&format=1`);
    let result = await res.json();

    let rate = 0;

    if ( result.quotes[`USD${currency}`] && result.quotes[`USD${reference}`]) {
        rate = result.quotes[`USD${currency}`] / result.quotes[`USD${reference}`]
    }

    ctx.body = {
        'currency': `${currency} to ${reference}`,
        'rate': rate,
        'amount': ctx.query.amount * rate
    };
})


