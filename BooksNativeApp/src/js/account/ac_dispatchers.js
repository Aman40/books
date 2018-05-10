import * as actions from "./ac_actions";
let DOMParser = require("xmldom").DOMParser;
import univ_const from "/var/www/html/books/BooksNativeApp/univ_const.json";
const host = univ_const.server_url;
import {AsyncStorage} from "react-native";

export /**/ function login(dispatch, payload) {
	//Payload must be {email, password}
	_login(dispatch, payload, (session_data)=>{
		//Dispatch login success and store credentials
		//Also dispatch NAVIGATE_TO
		console.log(objectToString(session_data));
		dispatch({
			type: actions.LOGIN_SUCCESS,
			payload: session_data,
		});
		//Navigate to init
		dispatch({
			type: actions.NAVIGATE_TO,
			payload: "init",
		});
		//Store credentials in the background

		AsyncStorage.setItem(
			"creds",
			JSON.stringify(payload),
			(error)=>{
				if(error) {
					console.log(objectToString(error));
				}
			}
		);
	});
}
function objectToString(Obj) {
	/*return value: [string] "property1=<type1>value1, property2=<type2>value2[, ..."
    * The req.session.cookie object doesn't have a toString() method
    * So I'm making my own generic one. It doesn't make prior assumptions
    * about the properties of the object. It, however, only returns a
    * string of enum()-able properties and their values*/
	if(!Obj) return "Not an object: Null or undefined.";
	let arr = Object.getOwnPropertyNames(Obj); //Get all the properties
	let returnString = "";
	for(let i=0;i<arr.length-1; i++) {
		returnString+=`${arr[i]}=<${typeof(Obj[arr[i]])}>: ${Obj[arr[i]]}, `;
	}
	return returnString+=`${arr[arr.length-1]}=${Obj[arr[arr.length-1]]}`; //The comma at the end
}

export /*to ac_connector*/ function createSession(context, dispatch) {
	/*
		1. Check if user is logged in, logs in, if not.
		2. If there exist stored credentials, login automatically.
		Otherwise, prompt manual login. Don't resume last request.
		Navigate to initial route.
		3. If context was from failed request, resume request upon success
		If context is start up, simply load initial route as "ready"
		4. Context argument should be object of structure:
		{
			type: enum("START_UP", "FAILED_REQ"),
			if(type==="FAILED_REQ") {
				dispatcher<function>, //function that failed the request
				arguments<Any>, //arguments initially passed to above dispatcher.
			}
		}
	*/
	//Check for session if startup context
	if(context.type==="START_UP") {
		//check for session
		let xhr = new XMLHttpRequest();
		xhr.responseType = "document";
		xhr.responseType = "text";
		xhr.onreadystatechange = function() {
			console.log(`Readystate: ${this.readyState}`);
			console.log(`Status: ${this.status}`);
			if(this.readyState===4 && this.status===200) {
				let Parser = new DOMParser();
				let xmlDoc = Parser.parseFromString(this.responseText);

				let srv_res_status = parseInt(xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue);
				console.log("Server status: "+srv_res_status);
				if(srv_res_status===0) {
					//Session exists
					let user_data = { //set user_data
						alias: xmlDoc.getElementsByTagName("alias")[0].childNodes[0].nodeValue,
						uid: xmlDoc.getElementsByTagName("uid")[0].childNodes[0].nodeValue,
						dob: xmlDoc.getElementsByTagName("dob")[0].childNodes[0].nodeValue,
						pref: xmlDoc.getElementsByTagName("pref")[0].childNodes[0].nodeValue,
						email: xmlDoc.getElementsByTagName("email")[0].childNodes[0].nodeValue,
						about: xmlDoc.getElementsByTagName("about")[0].childNodes[0].nodeValue,
						student: xmlDoc.getElementsByTagName("student")[0].childNodes[0].nodeValue,
					};
					console.log(user_data);

					dispatch({ //Store session
						type: actions.LOGIN_SUCCESS, //Session exists.
						payload: user_data,
					});
					//Ready. Dispatch action to navigatio to initial route
					dispatch({
						type: actions.NAVIGATE_TO,
						payload: "init",
					});
				}
				else {
					//No session. Check for stored credentials.
					_autoLoginWithCreds(context, dispatch);
				}

			} else {
				if(this.readyState===4) {
					//Not user's fault
					dispatch({
						type: actions.LOGIN_ERROR,
						payload: "The server responded with a "+this.status,
					});
				}
			}
		};
		try {
			console.log("Opening and sending");
			xhr.open("POST",`${host}`, true);
			xhr.send();
		}
		catch(error) {
			console.log("An error occured while trying to open and send");
			dispatch({
				type: actions.LOGIN_ERROR,
				payload: "Failed to either open or send the request. Fix it.",
			});
		}
	}
	else {
		_autoLoginWithCreds(context, dispatch);
	}
}

function _autoLoginWithCreds(context, dispatch) {
	//Checks for stored credentials and auto logs in if found.
	//Else, prompts for manual login by dispatching action to navigate to 
	//Manual login view. Code reuse is why this is a function.
	let credentials = null;
	//More code here. Get creds or null object. 
	AsyncStorage.getItem("creds", (error, result)=>{
		if(error) {
			//Handle error
			console.log(`Error reading from storage: ${error}`);
			//No credentials
			//prompt manual login. Dispatch appropriate action(s)
			dispatch({
				type: actions.PROMPT_MANUAL_LOGIN,
				payload: null,
			});
		} else {
			credentials = JSON.parse(result);
			//Has credentials. Auto login
			_login(dispatch, credentials,(session_data)=>{
				dispatch({
					type: actions.LOGIN_SUCCESS,
					payload: session_data,
				});
				context.dispatcher(context.args); //Resume the last action to fail.
			});
		}
	});
}

function _login(dispatch, credentials, callback) {
	/*
		The private function that handles
		1. Sending the login credentials to the db
		2. Sending session data to the store and
		3. Call the callback with user_data argument.
	*/
	//Payload must be {email, password}
	let fd = new FormData();
	fd.append("email", credentials.email);
	fd.append("password", credentials.password);

	let xhr = new XMLHttpRequest();
	xhr.responseType = "text";
	xhr.onreadystatechange = function() {
		console.log(`Readystate: ${this.readyState}`);
		console.log(`Status: ${this.status}`);
		if(this.readyState===4 && this.status===200) {
			let Parser = new DOMParser();
			let xmlDoc = Parser.parseFromString(this.responseText);

			let srv_res_status = parseInt(xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue);
			console.log("Server status: "+srv_res_status);
			if(srv_res_status===0) {
				let user_data = { //set user_data
					alias: xmlDoc.getElementsByTagName("alias")[0].childNodes[0].nodeValue,
					uid: xmlDoc.getElementsByTagName("uid")[0].childNodes[0].nodeValue,
					dob: xmlDoc.getElementsByTagName("dob")[0].childNodes[0].nodeValue,
					pref: xmlDoc.getElementsByTagName("pref")[0].childNodes[0].nodeValue,
					email: xmlDoc.getElementsByTagName("email")[0].childNodes[0].nodeValue,
					about: xmlDoc.getElementsByTagName("about")[0].childNodes[0].nodeValue,
					student: xmlDoc.getElementsByTagName("student")[0].childNodes[0].nodeValue,
				};
				console.log(user_data);
				callback(user_data);
			}
			else {
				console.log("Dispatching err");
				dispatch({
					type: actions.LOGIN_ERROR,
					payload: "The srv_res_status returned is "+srv_res_status,
				});
			}

		} else {
			if(this.readyState===4) {
				dispatch({
					type: actions.LOGIN_ERROR,
					payload: "The server responded with a "+this.status,
				});
			}
		}
	};
	try {
		console.log("Opening and sending");
		xhr.open("POST",`${host}/log/in`, true);
		xhr.send(fd);
	}
	catch(error) {
		console.log("An error occured while trying to open and send");
		dispatch({
			type: actions.LOGIN_ERROR,
			payload: "Failed to either open or send the request. Fix it.",
		});
	}
}

/*
TODO
1. Check for session check!
2. Store credentials check!
3. Check for stored credentials check!
4. I haven't used context
*/