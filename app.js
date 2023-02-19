const express = require("express");
const https = require('https');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const clientEmail = req.body.clientEmail;

  const data = {
    members: [{
      email_address: clientEmail,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  
  const jsonData = JSON.stringify(data);
  const url = "https://us8.api.mailchimp.com/3.0/lists/d49416f067";

  const options = {
    method: "POST",
    auth: "sarah1:6cfc95412ba7c2c9defde505703bb02f-us8"
  }
  // Creating a const to store data that we'll later post to Mailchimp server.
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // Looking out for any data we get from the mailchimp server.
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
//Passing json data to the mailchimp server.
// request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res){
// redirecting users to the home route to attempt email sign up again which triggers our app.get function which sends the sign up page as the file to be rendered on screen.
  res.redirect("/");
})


app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
