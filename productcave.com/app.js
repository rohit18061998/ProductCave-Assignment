const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const request = require("request");

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({extends: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.post('/subscribe', (req, res) => {
    const {email, js} = req.body;
    const mcData = {
        // update_existing: true,
        members: [{
            email_address: email,
            status: 'subscribed'

        }]
    }

    const mcDataPost = JSON.stringify(mcData);

    const options = {
        url: 'https://us1.api.mailchimp.com/3.0/lists/7232c48a13',
        method: 'POST',
        headers: {
            Authorization: 'auth b9de9a8ed7ca273606dc585c182280b7-us1'
        },
        body: mcDataPost
    }

    if (email) {
        request(options, (err, response, body) => {
            console.log(JSON.parse(body));
            if (JSON.parse(body).errors.length === 1) {
                if (!JSON.parse(body).errors[0].error.includes("is already a list member")) {
                    res.sendStatus(400);
                } else {
                    res.sendStatus(409);
                }
            }
         else {
                res.sendStatus(200);
            }
        })
    } else {
        res.status(404).send({message: 'Failed'})
    }
})

const PORT = process.env.POR || 5000;

app.listen(PORT, console.log('Server started!'));