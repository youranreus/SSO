const express = require('express');
const app = express();
const UserRoute = require('./routes/UserRoute')

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

module.exports = app;
