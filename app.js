let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let md5 = require('blueimp-md5');
let template = require('./util/template');
let MongoClient = require('mongodb').MongoClient;

let app = express();

const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url, {useNewUrlParser: true});
let curClient;

mongoClient.connect(function(err, client){
  if(err) {
    console.log(err);
    return;
  }
  curClient = client;
  app.locals.collection = client.db('usersdb').collection('users');
  app.listen(4000, function(){
    console.log('Listening port 4000');
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(index.html);
});

app.get('/:short', function(req, res){
  let param = req.params.short;
  let short = param.trim();
  
  let collection = req.app.locals.collection;
  collection.find({short: short}).toArray(function(err, users){
    if(err) return console.log(err);
    let redir_url = users[0].url;
    let count = users[0].count;
    let short = users[0].short;
    count++;
    collection.findOneAndUpdate(
      {short: short},
      {$set: {count: count}},
      function(err, updres){
        if(err) return console.log('Error update: ' + err);
        // console.log(updres);
      }
    );
    res.redirect(303, redir_url);
  });
});

app.post('/', function(req, res){
  let str_url = req.body.url;
  let url = str_url.trim();
  let hash = md5(url.toLowerCase());

  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let len_str = str.length;
  let short = "";
  let res_len = 7;
  
  let collection = req.app.locals.collection;
  collection.find({hash: hash}).toArray(function(err, users){
    if(err) return console.log(err);
  
    if(users.length == 0){
      for(let i = 0; i < res_len; i++){
        short += str[Math.floor(len_str * Math.random())];
      }
      let user = {hash: hash, url: url, short: short, count: 0};
      collection.insertOne(user, function(err, result){
        if(err) return console.log(err);
        let str = template({out: "http://localhost:4000/" + result.ops[0].short}); 
        res.send(str);
      });
    }else{
      let str = template({out: "http://localhost:4000/" + users[0].short});
      res.send(str);
    }
  });
  
});

process.on("SIGINT", function(){
  curClient.close();
  process.exit();
});