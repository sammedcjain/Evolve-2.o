const express = require('express');
const https=require("https");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

fs = require('fs'),
url = require('url');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://sammedcjain:mongodb8762@cluster0.gldyajt.mongodb.net/evolvedb",{useNewUrlParser:true});

const evSchema = new mongoose.Schema({
  company: String,
  vehicle: String,
  price: Number,
  range: Number,
  speed: Number
});

const Ev = mongoose.model('Ev', evSchema);

const ev1=new Ev({
  company: "Ola",
  vehicle: "Ola S1 Pro",
  price: 129000,
  range: 181,
  speed: 116
});

const ev2=new Ev({
  company: "Ola",
  vehicle: "Ola S1",
  price: 109999,
  range: 141,
  speed: 95
});

const ev3=new Ev({
  company: "Ola",
  vehicle: "Ola S1 Air",
  price: 109999,
  range: 165,
  speed: 85
});

const ev4=new Ev({
  company: "Ather",
  vehicle: "Ather 450 X",
  price: 158462,
  range: 105,
  speed: 90
});

const ev5=new Ev({
  company: "Ather",
  vehicle: "Ather 450 plus",
  price: 109999,
  range: 85,
  speed: 90
});

test=[ev1,ev2,ev3,ev4,ev5];


Ev.find({company:"Ola"}).then(
  (result) => {
    if(result.length){
      console.log("redundant pairs detected!!!");
    }else{
      Ev.find({company:"Ather"}).then(
        (result) => {
          if(result.length){
            console.log("redundant pairs detected!!!");
          }else{
            Ev.insertMany(test).then(
              (result) => {
                console.log("Items added successfully");
              }
            ).catch(
              (err) => {
                console.log(err);
              });
          }
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      );
    }
  }
).catch(
  (err) => {
    console.log(err);
  }
);



app.get("/", function(req, res){
  res.sendFile(__dirname+"/index.html");
});

app.get("/authentication",function(req,res){
  res.sendFile(__dirname+"/admin_authentication.html");
});

app.get("/fail",function(req,res){
  res.sendFile(__dirname+"/auth_failed.html");
});

app.get("/kookaburra",function(req,res){
  res.sendFile(__dirname+"/admin.html");
});

app.post("/authentication",function(req,res){
  res.redirect("/authentication");
  console.log("Admin access requested");

  // var body = '';
  // filePath = __dirname + "admin_authetication.html";
  // req.on('data', function(data) {
  //     body += data;
  // });
  //

 // req.on('end', function (){
 //     fs.appendFile(filePath, body, function() {
 //         res.end();
 //     });
 // });

})

app.post("/admin",function(req,res){
  if(req.body.username=="sam" && req.body.pass==12345){
   console.log("Authetication successful");
   res.redirect("/kookaburra");
 }else{
   console.log("Authetication failed");
   res.redirect("/fail");
 }
})

app.post("/data",function(req,res){
  var comp= req.body.company;
  var pri = req.body.price;
  if(pri!="any")
  {pri=pri*1000;}
  else if (pri=="any") {
    pri=10000000
  }
  var ran = req.body.range;
  if(ran=="any"){ran=0}
  var spd = req.body.speed;
  if(spd=="any"){spd=0}
  console.log(comp,pri,ran,spd);

  if(req.body.showall=='showall'){
    Ev.find().then(
      (result) => {
        var data=[];
         result.forEach(function(each){
            //console.log(each);
            data.push(each);
         })
         res.render("dbtable", {evdb:data});
      }
    ).catch(
      (err) => {
         console.log(err);
      })
  }
  else if(comp=='any')
  {
    Ev.find({price:{$lte:pri},range:{$gte:ran},speed:{$gte:spd}}).then(
      (result) => {
        var data=[];
         result.forEach(function(each){
            //console.log(each);
            data.push(each);
         })
         res.render("dbtable", {evdb:data});
      }
    ).catch(
      (err) => {
         console.log(err);
      })
  }
  else if(pri!=126000){

  Ev.find({company:comp,price:{$lte:pri},range:{$gte:ran},speed:{$gte:spd}}).then(
    (result) => {
      var data=[];
       result.forEach(function(each){
          //console.log(each);
          data.push(each);
       })
       res.render("dbtable", {evdb:data});
    }
  ).catch(
    (err) => {
       console.log(err);
    })
  }else{
    Ev.find({company:comp,price:{$gte:pri},range:{$gte:ran},speed:{$gte:spd}}).then(
      (result) => {
        var data=[];
         result.forEach(function(each){
            //console.log(each);
            data.push(each);
         })
         res.render("dbtable", {evdb:data});
      }
    ).catch(
      (err) => {
         console.log(err);
      })
  }
    var body = '';
    filePath = __dirname + "/views/dbtable.ejs";
    req.on('data', function(data) {
        body += data;
    });

    req.on('end', function (){
        fs.appendFile(filePath, body, function() {
            res.end();
        });
    });
});

app.post("/dbupdate",function(req,res){
  const comp_up=req.body.company;
  const vehi_up=req.body.vehicle;
  const pri_up=req.body.price;
  const rang_up=req.body.range;
  const spd_up=req.body.speed;

  var evs=new Ev({
    company: comp_up,
    vehicle: vehi_up,
    price: pri_up,
    range: rang_up,
    speed: spd_up
  });
  //console.log(Ev.find({company:comp_up,vehicle:vehi_up}));
  Ev.find({company:comp_up,vehicle:vehi_up}).then(
    (result) => {
       if(result.length){
         console.log("Db already exists ! cannot add redundant pairs");
         res.jsonp({redundant : true})
       }else{
         Ev.insertMany(evs).then(
         (result) => {
         console.log("Items added succesfully");
         res.jsonp({added : true})
       }
  ).catch(
    (err) => {
       console.log(err);
    }
  )
       }
    }
  ).catch(
    (err) => {
       console.log(err);
    }
  )
});



app.post("/dbdelete",function(req,res){
  var item=1;
  const veh_del = req.body.vehicle_del;
  Ev.find({vehicle:veh_del}).then(
    (resu)=>{
      if(resu.length){
      console.log("Deletion in progress");
    }else{
      console.log("Item not found !!");
      res.jsonp({ItemNotfound : true})
      item=0;
    }
    }
  ).catch(
    (err) => {
       console.log(err);
    }
  )

  Ev.deleteOne({ vehicle:veh_del }).then(
    (result) => {
       Ev.find({vehicle:veh_del}).then(
         (results) => {
           if(results.length){
            console.log("Could'nt find your specified item!");
            res.jsonp({ItemNotfound : true})
          }else{
            if(item!=0){
            console.log(veh_del+ " Deleted successfully !");
            res.jsonp({deleted_successfully : true})
          }
          }
         }
       ).catch(
         (err) => {
            console.log(err);
         }
       )

    }
  ).catch(
    (err) => {
       console.log(err);
    }
  )

})

let port = process.env.PORT;
if(port==null || port ==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
