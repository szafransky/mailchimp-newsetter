//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
//inint app
const app = express();

app.use(express.static('public'));


//use body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port 3000');
});

app.get('/signup', function(req, res) {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post('/failure', function(req, res) {
  res.redirect('/signup');
});

app.post('/signup', function(req, res) {
  let firstName = req.body.name;
  let lastName = req.body.lastName;
  let email = req.body.email;

  let data = {
    members: [
    {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
    ]
  };

  let jsonData = JSON.stringify(data);
  let url = 'https://us7.api.mailchimp.com/3.0/lists/bd0a2d8f7e';
  let options = {
    method: 'POST',
    auth: 'newApp:76bab91342f81a6bbbdd021ee7f57d87-us'
  };

  const request = https.request(url, options, function(response) {

    if(response.statusCode == 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    response.on('data', function(data) {
      console.log(JSON.parse(data));
    });
  });

console.log(res);


  request.write(jsonData);
  request.end();
});


//API apiKey: 76bab91342f81a6bbbdd021ee7f57d87-us7
//list ID: bd0a2d8f7e
