const express = require('express');
const app = express();
const UserRoute = require('./routes/UserRoute')
const EmailRoute = require('./routes/EmailRoute')

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.result = {
        msg: "",
        code: 0,
        data: {}
    }

    next()
})

app.use('/api/user', UserRoute)
app.use('/api/email', EmailRoute)

module.exports = app;
