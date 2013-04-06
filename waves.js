var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://localhost/brainscan');

var waveSchema = mongoose.Schema({
    _id : String,
    date_struct : [{
        date_hour : Number,
        date_min : Number,
        date_year : Number,
        date_sec : Number,
        date_month : Number,
        date_day : Number
    }],
    data : [
        Number,
        Number,
        Number,
        Number,
        Number,
        Number,
        Number,
        Number,
        Number,
        Number,
        Number
    ]
})

var Wave = mongoose.model('Wave', waveSchema)

app.use(express.static(__dirname + '/'));
/*
app.get('/', function(req, res) {
   
    fs.readFile('./index.html', function (err, data) {
        
        if (err) {
            throw err;
        }
        
        res.setHeader('Content-Type', 'text/html');
        res.send(data);
        
    });
 
});
*/

app.get('/waves', function(req, res) {
    
    limit = 100;
    
    w1 = [];
    w2 = [];
    w3 = [];
    w4 = [];
    w5 = [];    
    w6 = [];
    w7 = [];    
    w8 = [];
    w9 = [];    
    w10 = [];
    w11 = [];
    
    if (req.query.limit) { limit = req.query.limit; }
    
    Wave.find().limit(limit).exec(function (err, waves) {
        
        
        for (i=0;i<waves.length;i++) { 
        
            w1.push({x: i, y: waves[i]['data'][0]});
            w2.push({x: i, y: waves[i]['data'][1]});
            w3.push({x: i, y: waves[i]['data'][2]});
            w4.push({x: i, y: waves[i]['data'][3]});
            w5.push({x: i, y: waves[i]['data'][4]});
            w6.push({x: i, y: waves[i]['data'][5]});
            w7.push({x: i, y: waves[i]['data'][6]});
            w8.push({x: i, y: waves[i]['data'][7]});
            w9.push({x: i, y: waves[i]['data'][8]});
            w10.push({x: i, y: waves[i]['data'][9]});
            w11.push({x: i, y: waves[i]['data'][10]});
            
        }
        
        graphdata = [
            {
              area: true,
              values: w1,
              key: "w1",
              color: "blue"
            },
            {
              values: w2,
              key: "w2",
              color: "green"
            },
            {
              values: w3,
              key: "w3",
              color: "yellow"
            },
            {
              values: w4,
              key: "w4",
              color: "red"
            },
            {
              values: w5,
              key: "w5",
              color: "purple"
            },
            {
              values: w6,
              key: "w6",
              color: "orange"
            },
            {
              values: w7,
              key: "w7",
              color: "black"
            },
            {
              values: w8,
              key: "w8",
              color: "lightblue"
            },
            {
              values: w9,
              key: "w9",
              color: "darkgreen"
            },
            {
              values: w10,
              key: "w10",
              color: "brown"
            },
            {
              values: w11,
              key: "w11",
              color: "aqua"
            }
          ];
  
        if (req.query.callback)
            res.send(req.query.callback + '(' + JSON.stringify(graphdata) + ')');
        else
            res.send(graphdata);
            
    });

});
 
app.listen(3000);
console.log('Listening on port 3000...');