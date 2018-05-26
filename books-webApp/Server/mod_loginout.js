
//This handles logging in and out of the application. It routes to /login and /logout
//Sessions will be handles here and in the signup module
const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");

router.use("/in", function (req, res) {
	res.writeHead(200, {"Content-Type":"text/html", "Access-Control-Allow-Origin": "http://localhost:3000"});
	res.write("<?xml version='1.0' encoding='UTF-8' ?>");
	res.write(`<cookie>${res.getHeader("Set-Cookie")}</cookie>`); //DEV.
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files)=>{
		if(err) {
			console.log(err.name);
			console.log(err.message);
			res.end("<srv_res_status>6</srv_res_status>");
			return;
		}
		const conn = mysql.createConnection({
			host: "localhost",
			user: "aman",
			password: "password",
			database: "books"
		});
		conn.connect((err)=>{
			if(err) {
				console.log(err.name);
				console.log(err.message);"";
				res.end("<srv_res_status>6</srv_res_status>");
				return;
			}
			let sql = `SELECT * FROM Users WHERE Email = '${fields.email}'`;
			conn.query(sql, (err, result)=>{
				if(err) {
					console.log(err.name);
					console.log(err.message);
					res.write("<msg>An sql related error occurred.</msg>");
					res.end("<srv_res_status>4</srv_res_status>");
					return;
				}
				if(result.affectedRows===0) {
					res.write("<msg>No such email was found</msg>");
					res.end("<srv_res_status>3</srv_res_status>");
				} else {
					//Compare passwords
					let hash = result[0].UserPassword;
					bcrypt.compare(fields.password, hash, (err, check_result)=>{
						if(err) {
							console.log(err.name);
							console.log(err.message);
							res.end("<srv_res_status>6</srv_res_status>");
							return;
						}
						if(check_result) {
							//success. Start session
							let usr_data = {}; //Stringify and send to user.
							req.session.alias = usr_data.alias = result[0].NameAlias;
							req.session.uid = usr_data.uid = result[0].UserID;
							req.session.sex = usr_data.sex = result[0].Sex;
							req.session.dob = usr_data.dob = result[0].DoB;
							req.session.pref = usr_data.pref = result[0].Prefecture;
							req.session.email = usr_data.email = result[0].Email;
							req.session.about = usr_data.about = result[0].About;
							req.session.student = usr_data.student = result[0].Student?true:false;
							req.session.school = usr_data.school = result[0].School;
							req.session.schoolzip = usr_data.schoolzip = result[0].SchoolZip;
							//Copy a part of the session data and echo it back to the user.

							//Return JSON string of names and values to be parsed into an obj
							res.write(`<usr_info>${JSON.stringify(usr_data)}</usr_info>`);
							res.write("<msg>Successfully logged in!</msg>");
							res.end("<srv_res_status>0</srv_res_status>");
						} else {
							//failure
							res.write("<msg>Password error</msg>");
							res.end("<srv_res_status>1</srv_res_status>");
						}
					});
				}
			});
		});
	});
});
router.use("/out", function (req, res) {
	res.writeHead(200, {"Content-Type":"text/html", "Access-Control-Allow-Origin": "http://localhost:3000"});
	res.write("<?xml version='1.0' encoding='UTF-8' ?>");

});

module.exports = router;
//DESCRIPTION OF EXIT CODES/RETURN STATUSES srv_res_status
//0: Success
//1: Duplicate entry of email or alias
//2: Illegal characters in input
//3: No results found
//4: Query error
//5: Connect error
//6: Other system errors
//7: Passwords don't match