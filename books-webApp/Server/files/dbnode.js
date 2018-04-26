var mysql = require('mysql');
const utils = require('util')

var con = mysql.createConnection({
    host: "localhost",
    user: "aman",
    password: "password",
    database: "books"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('show databases', (err, result)=>{
        if(err) throw err;
        console.log(`Result: ${utils.inspect(result)}`);
    });
});