const express = require('express');
const app = express();
const UserRoute = require('./routes/UserRoute')
const EmailRoute = require('./routes/EmailRoute')

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","content-type");
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() === 'options')
        res.send(200);
    else
        next()
})

app.use('/api/user', UserRoute)
app.use('/api/email', EmailRoute)

module.exports = app;
