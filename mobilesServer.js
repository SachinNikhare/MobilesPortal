let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const {Client} = require("pg");
const client = new Client({
  user: "postgres",
  password: "&@(#!n@nikhare",
  port: 5432,
  host: "db.jyrbjpmkudbexvqqrmpu.supabase.co",
  ssl: {rejectUnauthorized: false},
});
client.connect(function(res,error){
  console.log("Connected!!!");
});


app.get("/mobiles/:property/:value",function(req,res,next){
  const property = req.params.property;
  const value = req.params.value;
  console.log(`Inside /mobiles/:${property}/:${value}`);
  const query = `SELECT * FROM mobiles WHERE ${property}=$1`;
  client.query(query,[value],function(err,result){
    if(err){
      console.log(err);
      return res.status(440).send(err);
    }
    return res.send(result.rows);
    client.end();
  });
});

// app.get("/mobiles/rom/:rom",function(req,res,next){
//   console.log("Inside /mobiles/rom/:rom");
//   const query = "SELECT * FROM mobiles WHERE rom=$1";
//   client.query(query,function(err,result){
//     if(err){
//       console.log(err);
//     }
//     return res.send(result.rows);
//     client.end();
//   });
// });


app.get("/mobiles",function(req,res,next){
    console.log("Inside /mobiles get api");
    const query = `SELECT * FROM mobiles`;
    client.query(query,function(err,result){
        if(err){
            console.log(err);
            return res.status(440).send(err);
        }
        console.log("ROWS",result.rows);
        return res.send(result.rows);
        client.end();
    });
});

// INSERT INTO mobiles(name, price, brand, ram, rom, os) VALUES ("iPhone XR",49000,"Apple","4GB","128GB","iOS");

app.post("/mobile",function(req,res,next){
    console.log("Inside post of mobile");
    let values = Object.values(req.body);
    console.log(values);
    const query = `INSERT INTO mobiles(name, price, brand, ram, rom, os) VALUES ($1,$2,$3,$4,$5,$6)`;
    client.query(query,values,function(err,result){
        if(err){
            return res.status(400).send(err);
        }
        console.log(result)
        return res.send(`${result.rowCount} insertion successful`);
    })
})