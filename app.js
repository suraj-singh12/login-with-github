const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const superagent = require('superagent');
const request = require('request');
const port = process.env.PORT || 9700;
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.send("<a href='/OAuth'> Login With Github </a>");
})
app.get('/OAuth', (req, res) => {
    // res.send("<a href=`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`> Login With Git </a>")
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`);
})

app.get('/profile', (req, res) => {
    const code = req.query.code;
    if(!code) {
        res.send('Invalid Login!')
    }
    superagent
    .post('https://github.com/login/oauth/access_token')
    .send({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code
    })
    .set('Accept', 'application/json')
    .end((err, result) => {
        if(err) throw err;
        let access_token = result.body.access_token;
        const option = {
            uri: 'https://api.github.com/user',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `token ${access_token}`,
                'User-Agent': 'Mycode'
            }
        }
        request(option, (err, response, body) => {
            res.send(body);
        })
    })
})
app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(`http://localhost:${port}`);
})