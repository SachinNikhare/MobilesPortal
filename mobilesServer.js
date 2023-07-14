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

app.get("/mobiles",function(req,res,next){
  let {brand="", ram="", rom="", os="",sortby=""} = req.query;
  let query;
  let params = [];
  if(brand){
    brand = brand.split(",").map(b=>"'"+b+"'")
    params.push("brand IN ("+brand+")");
  }
  if(ram){
    ram = ram.split(",").map(r=>"'"+r+"'")
    params.push("ram IN ("+ram+")");
  }
  if(rom){
    rom = rom.split(",").map(r=>"'"+r+"'")
    params.push("rom IN ("+rom+")");
  }
  if(os){
    os = os.split(",").map(o=>"'"+o+"'")
    params.push("os IN ("+os+")");
  }
  params = params.join(" AND ")
  if(params){
    if(sortby)
      query = `SELECT * FROM mobiles WHERE ${params} ORDER BY ${sortby}`;
    else
      query = `SELECT * FROM mobiles WHERE ${params}`;
  }
  else{
    if(sortby)
      query = `SELECT * FROM mobiles ORDER BY ${sortby}`;
    else
      query = `SELECT * FROM mobiles`;
  }
  console.log(query);
  client.query(query,function(err,result){
      if(err){
          console.log(err);
          return res.status(440).send(err);
      }
      return res.send(result.rows);
      client.end();
  });
})


//This method is used to add a mobile in the database.

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


//This method is used to edit the mobile data by mobile name.

app.put("/edit/:name",function(req,res,next){
  console.log("Inside put of mobiles");
  let name = req.params.name;
  let body = req.body;
  const {price, brand, ram, rom, os} = body;
  let values = [price,brand,ram,rom,os,name];
  const query = `UPDATE mobiles SET price=$1, brand=$2, ram=$3, rom=$4, os=$5 WHERE name=$6`;
  client.query(query,values,function(err,result){
      if(err){
          return res.status(400).send(err);
      }
      else{
          return res.send(`${result.rowCount} updation successful`);
      }
  });
});



//This method is used to delete the mobile from the database by mobile name
app.delete("/delete/:name",function(req,res,next){
  console.log("Inside Delete of employees");
  let name = req.params.name;
  const query = `DELETE FROM mobiles WHERE name=$1`;
  client.query(query,[name],function(err,result){
      if(err){
          return res.status(400).send(err);
      }
      else{
          return res.send(`${name} deleted`);
      }
  });
});