import * as actions from "./ac_actions";
let DOMParser = require("xmldom").DOMParser;
import univ_const from "/var/www/html/books/BooksNativeApp/univ_const.json";
const host = univ_const.server_url;
import {AsyncStorage} from "react-native";
import {objectToString} from "../shared_components/shared_utilities";

export /**/ function login(dispatch, payload) {
	//Payload must be {email, password}
	_login(dispatch, payload, (session_data)=>{
		//Dispatch login success and store credentials
		dispatch({
			type: actions.LOGIN_SUCCESS,
			payload: session_data,
		});
		//
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

const START_UP = "connect_at_start_up";
module.exports.START_UP = START_UP;
const FAILED_REQ = "connect_on_failed_request";
module.exports.FAILED_REQ = FAILED_REQ;

export /*to books_view*/ function createSession(context, dispatch) {
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
	if(context.type===START_UP) {
		//check for session
		//Navigate to init
		let xhr = new XMLHttpRequest();
		xhr.responseType = "text";
		xhr.onreadystatechange = function() {
			if(this.readyState===4 && this.status===200) {
				let Parser = new DOMParser();
				let xmlDoc = Parser.parseFromString(this.responseText);

				let srv_res_status = xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue;
				srv_res_status = parseInt(srv_res_status);
				if(srv_res_status===0) {
					//Session exists
					let usrDataObj = JSON.parse(xmlDoc.getElementsByTagName("usr_info")[0].childNodes[0].nodeValue);
					let user_data = { //set user_data
						alias: usrDataObj["alias"],
						uid: usrDataObj["uid"],
						sex: usrDataObj["sex"],
						dob: usrDataObj["dob"],
						pref: usrDataObj["pref"],
						email: usrDataObj["email"],
						about: usrDataObj["about"],
						student: usrDataObj["student"],
						school: usrDataObj["school"],
					};

					dispatch({ //Store session
						type: actions.LOGIN_SUCCESS, //Session exists.
						payload: user_data,
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
	AsyncStorage.getItem("creds", (error, result)=>{
		//Automatically get creds
		if(error) {
			//Oops! None found! Display a notification and ask the user to login
			//or create an account.
			console.log(`Error reading from storage: ${error}`);
			//No credentials. prompt manual login. Dispatch appropriate action(s)
			dispatch({
				type: actions.LOGIN_ERROR,
				payload: "",
			});
			//TODO: Dispatch an action to mark the action in the context as failed.
		} else {
			//If it's successful though, resume the last request, which should be in
			//the context as a dispatcher and its arguments.
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
		if(this.readyState===4 && this.status===200) {
			let Parser = new DOMParser();
			let xmlDoc = Parser.parseFromString(this.responseText);

			let srv_res_status = parseInt(xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue);

			let usrDataObj = JSON.parse(xmlDoc.getElementsByTagName("usr_info")[0].childNodes[0].nodeValue);

			if(srv_res_status===0) {
				let user_data = { //set user_data
					alias: usrDataObj["alias"],
					uid: usrDataObj["uid"],
					sex: usrDataObj["sex"],
					dob: usrDataObj["dob"],
					pref: usrDataObj["pref"],
					email: usrDataObj["email"],
					about: usrDataObj["about"],
					student: usrDataObj["student"],
					school: usrDataObj["school"],
				};
				callback(user_data);
			}
			else {
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
4. I haven't used context check!
5. Deal with routing by actions.xxx
5. AMMENDED: Change of philosophy. Upon successful login, simply navigate back to
the ACCOUNT route according to the isLoggedIn flag.
6. Storing the passwords in ***** ****. Gotta hash and salt them before production.
*/
