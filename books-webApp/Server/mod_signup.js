//This does no routing whatsoever. Handles signup forms.
//Sessions will be handled here and in mod_loginout
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const uuid = require("uuid/v4");
const { check, validationResult } = require("express-validator/check");
const url = require("url");


router.post("/files", function () {
	//Handle profile picture uploads here. End request;
});

//Sanitize, validate. Ends req if err
// noinspection JSUnresolvedFunction
router.post("/",[
	check("alias")
		.not()
		.isEmpty()
		.withMessage("ER_NO_NAME")
		.escape()
		.trim(),
	check("email")
		.isLength({min: 7}) /*For some reason I couldn't use the .not().isEmpty()*/
		.withMessage("ER_NO_EMAIL")
		.isEmail()
		.withMessage("ER_EMAIL_FORMAT")
		.trim()
		.normalizeEmail(),
	check("sex")
		.isIn(["M", "F"])
		.withMessage("ER_SEX"),
	check("dob")
		.not()
		.isEmpty()
		.withMessage("ER_NO_DOB"),
	check("pref")
		.not()
		.isEmpty()
		.withMessage("ER_NO_PREF"),
	check("about")
		.not()
		.isEmpty()
		.withMessage("ER_NO_ABOUT") //To prevent the subsequent errors from being sent. Works because of "onlyFirstError: true"
		.isLength({max: 255})
		.withMessage("ER_ABOUT_LENGTH")
		.trim()
		.escape(),
	check("school")
		.optional({nullable: true, checkFalsy: true})
		.isLength({max: 255})
		.withMessage("ER_SCH_LENGTH")
		.trim()
		.escape(),
	check("schoolzip")
		.isNumeric()
		.withMessage("ERR_NUMERIC")
		.isLength({min: 7, max: 7})
		.withMessage("ERR_LENGTH"),
	check("password1")
		.not()
		.isEmpty()
		.withMessage("ER_NO_PASSWD"),
	check("password2")
		.not()
		.isEmpty()
		.withMessage("ER_NO_PASSWD")
], (req, res, next)=>{

	res.write("<?xml version='1.0' encoding='UTF-8' ?>");
	res.write(`<cookie>${res.getHeader("Set-Cookie")}</cookie>`); //DEV

	//Check the validation result here
	let result = validationResult(req);
	if(result.isEmpty()) {
		next();
	} else {
		//Format the errors and echo them back to the client
		//The query ends here
		//Return an array of validation results/errors. Only the first error
		let error_array = result.array({onlyFirstError: true});

		res.write(`<err_arr>${JSON.stringify(error_array)}</err_arr>`);
		res.write("<msg>There was a problem with the form entries</msg>");

		res.end("<srv_res_status>8</srv_res_status>");
	}
});

router.post("/", function (req, res) {
	let fields = url.parse(req.url, true/*return object*/).query;
	//Insert data in db, initialize session
	//Fields: ["alias", "email", "password1", "password2", "sex", "dob", "pref", "about", "student", "school", "curr_date_time"]
	const con = mysql.createConnection({
		host: "localhost",
		user: "aman",
		password: "password",
		database: "books"
	});
	con.connect((err)=>{
		if(err) throw err; //Report a connection error
		let sql="INSERT INTO Users(`UserID`, `UserPassword`, `JoinDate`, `NameAlias`, `Sex`, " +
            "`DoB`, `Email`, `Prefecture`, `About`, `Student`, `School`, `SchoolZip`) VALUES ?";
		//process password here. Either start processing and then callback
		passwordHasher(res, fields.password1, (hashed_password)=>{
			let uid = genUid("U");
			let form_fields = [[uid,/*Synchronously generates 14 character UID*/
				hashed_password,
				fields.curr_date_time,
				fields.alias,
				fields.sex,
				fields.dob,
				fields.email,
				fields.pref,
				fields.about,
				fields.student==="true"?1:0,
				fields.school,
				fields.schoolzip]];

			con.query(sql, [form_fields], (err, result)=>{
				if(err) {
					if(err.code==="ER_DUP_ENTRY") {
						//Duplicate username or email. Send back a code. Translate on client side
						res.write("<srv_res_status>1</srv_res_status>");
						res.end("<msg>Username or email is already in use.</msg>");
						return;
					} else if(err.code==="ER_INVALID_CHARACTER_STRING") {
						//Invalid characters used in the form. Send back code. Translate on client side
						res.write("<srv_res_status>2</srv_res_status>");
						res.end("<msg>Invalid characters in the form</msg>");
						return;
					} else {
						//Errors unrelated to the user
						res.write("<srv_res_status>4</srv_res_status>");
						res.end("<msg>A problem with the query occurred</msg>"); //Perhaps attempted SQL injection?
						return;
					}
				}
				console.log(result);
				//Handle result. Write session data
				let usr_data = {}; //Stringify and send to user.
				req.session.alias = usr_data.alias = fields.alias;
				req.session.uid = usr_data.uid = uid;
				req.session.sex = usr_data.sex = fields.sex;
				req.session.dob = usr_data.dob = fields.dob;
				req.session.pref = usr_data.pref = fields.pref;
				req.session.email = usr_data.email = fields.email;
				req.session.about = usr_data.about = fields.about;
				req.session.student = usr_data.student = fields.student;
				req.session.school = usr_data.school = fields.school;
				req.session.schoolzip = usr_data.schoolzip = fields.schoolzip;
				//Copy a part of the session data and echo it back to the user.

				//Return JSON string of names and values to be parsed into an obj
				res.write(`<usr_info>${JSON.stringify(usr_data)}</usr_info>`);
				res.write("<msg>Successfully signed up!</msg>");
				res.end("<srv_res_status>0</srv_res_status>");
			});
		});
	});
});

function genUid(char) {
	//This is meant to function as the php uid(index) function, generating a 14 character uid starting with the
	//provided index. If I get more of such I'll create a separate module
	let str = uuid(); //Gives a 36 character string with hyphenes.
	str = str.split("-"); //Gives an array
	let _tmp = "";
	for(let i = 0; i<str.length; i++) { //Concatenate it back into a string
		_tmp+=str[i];
	}
	return char+_tmp.toString().slice(0,13); //Get 13 characters, concat the first char = 14 characters;
}
function passwordHasher(res, password, callback) {
	console.log(`Password to hash: ${password}`);
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			if(err) {
				console.log(err.name);
				console.log(err.message);
				//Errors unrelated to the user
				res.write("<srv_res_status>4</srv_res_status>");
				res.end("<msg>A server error occured. Stay calm and call the admin.</msg>"); //Perhaps attempted SQL injection?
				return;
			}
			callback(hash);
		});
	});
}
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
//8: Error in form

/*
EvalError	    An error has occurred in the eval() function
RangeError	    A number "out of range" has occurred
ReferenceError	An illegal reference has occurred
SyntaxError	    A syntax error has occurred
TypeError	    A type error has occurred
URIError	    An error in encodeURI() has occurred
err.code: Either a MySQL server error (e.g. 'ER_ACCESS_DENIED_ERROR'), a Node.js error (e.g. 'ECONNREFUSED') or an internal error (e.g. 'PROTOCOL_CONNECTION_LOST').
err.fatal: Boolean, indicating if this error is terminal to the connection object. If the error is not from a MySQL protocol operation, this properly will not be defined.
err.sql: String, contains the full SQL of the failed query. This can be useful when using a higher level interface like an ORM that is generating the queries.
err.sqlMessage: String, contains the message string that provides a textual description of the error. Only populated from MySQL server error.
{
  "ER_DUP_ENTRY": "A value that should be unique is being reused",
  "ER_INVALID_CHARACTER_STRING": "An invalid character set is being used"
}
 */