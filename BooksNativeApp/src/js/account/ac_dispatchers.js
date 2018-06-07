import * as actions from "./ac_actions";
import { DOMParser } from "xmldom";
import univ_const from "/var/www/html/books/BooksNativeApp/univ_const.json";
const host = univ_const.server_url;
import {AsyncStorage} from "react-native";
import {objectToString} from "../shared_components/shared_utilities";
import RNRestart from "react-native-restart";
import { isbn as ISBN } from "simple-isbn";
import { getCurrDate, MyFormData } from "../shared_components/shared_utilities";

export /**/ function login(dispatch, payload) {
	//Payload must be {email, password}
	//Manual login. Exported to login screen
	_login(dispatch, payload, (session_data)=>{
		//Dispatch login success and store credentials
		dispatch({
			type: actions.LOGIN_SUCCESS,
			payload: session_data,
		});
		//Store credentials in the background
		AsyncStorage.setItem(
			"creds",
			JSON.stringify(payload),
			(error)=>{
				if(error) {
					console.log(objectToString(error));
				} else {
					console.log("Stored creds successfully");
					RNRestart.Restart();
				}
			}
		);
	});
}

const START_UP = "connect_at_start_up";
const _START_UP = START_UP;
export { _START_UP as START_UP };
const FAILED_REQ = "connect_on_failed_request";
const _FAILED_REQ = FAILED_REQ;
export { _FAILED_REQ as FAILED_REQ };

export /*to books_view*/ function createSession(context, dispatch) {
	/*
		Called when the app starts. OR
		When a request fails due to an expired session
		1. Check if user is logged in, logs in, if not.
		2. If there exist stored credentials, login automatically.
		Otherwise, (don't prompt manual login). Don't resume last request.
		Reload the app.
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
					console.log("No session exists. Attempting auto login.");
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
		//Will come in handy to handle expired requests and resume the last request.
		_autoLoginWithCreds(context, dispatch);
	}
}

function _autoLoginWithCreds(context, dispatch) {
	/*
		Checks for stored credentials and auto logs in if found.
		What happens next will shock you! Depending on context.type, the app's
		javascrips bundle reloads OR calls the last failed request.
		Else, prompts for manual login by dispatching action to navigate to
		Manual login view. Code reuse is why this is a function.
	*/
	try {
		let credentials = null;
		AsyncStorage.getItem("creds", (error, result)=>{
		//Automatically get creds
			console.log("Returned from creds search!");
		
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
			} else if(!result) {
				console.log("No creds found");
				AsyncStorage.getAllKeys((err, keys)=>{
					if(err) {
						console.log("----Error getting keys-----");
					} else {
						let  outStr=`${keys.length} keys found: `;
						for(let i = 0; i<keys.length;i++) {
							outStr+=keys[i];
						}
						console.log(outStr);
					}

				});
				dispatch({
					type: actions.LOGIN_ERROR,
					payload: "",
				});
			} else {
			//If it's successful though, resume the last request, which should be in
			//the context as a dispatcher and its arguments.
				credentials = JSON.parse(result);
				console.log(`Found creds: ${credentials}`);
				//Has credentials. Auto login
				_login(dispatch, credentials,(session_data)=>{
					dispatch({
						type: actions.LOGIN_SUCCESS,
						payload: session_data,
					});
					if(context.type===FAILED_REQ) {
						context.dispatcher(context.args); //Resume the last action to fail.
					}
				});
			}
		});
	} catch(error) {
		console.error("An error with the async storage occurred!");
		dispatch({
			type: actions.LOGIN_ERROR,
			payload: "Error accessing storage!",
		});
	}
}

function _login(dispatch, credentials, callback) {
	/*
		The private function that handles
		1. Sending the login credentials to the db
		2. Sending session data to the store and
		3. Call the callback with user_data argument.
		4. Dispatches appropriate errors upon failure.
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
		dispatch({
			type: actions.LOGIN_ERROR,
			payload: "Failed to either open or send the request. Fix it.",
		});
	}
}

export function showAccountMenu(dispatch) {
	dispatch({
		type: actions.SHOW_AC_MENU,
		payload: "meh",
	});
}
export function hideAccountMenu(dispatch) {
	dispatch({
		type: actions.HIDE_AC_MENU,
		payload: "meh",
	});
}

export function logout(dispatch) {
	//send logout request to server, and if successful, destroy stored creds and 
	//all store user data.
	console.log("Logging out");
	let xhr = new XMLHttpRequest();
	xhr.responseType = "text";

	xhr.onreadystatechange = function(){
		if(this.readyState===4 && this.status===200) {
			//Successfully logged out. Dispatch logout_successful
			let Parser = new DOMParser();
			let xmlDoc = Parser.parseFromString(this.responseText);

			let srv_res_status = xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue;
			srv_res_status = parseInt(srv_res_status);
			if(srv_res_status===0) {
				console.log("Logging out: Step 1; done.");
				//Delete the stored creds.
				try {
					console.log("Attempting to delete creds");
					AsyncStorage.removeItem("creds").then((error)=>{
						if(error) {
							//Re-login with the creds. Might as well
							console.log("(then)Error deleting creds, so re-logging in");
							console.log(`Error: ${error}`);
							const context = {
								type: START_UP,
								payload: "none",
							};
							_autoLoginWithCreds(context, dispatch);
							console.log("An error occurred removing the creds");
						} else {
							console.log("Logging out: step 2; done.");
							dispatch({
								type: actions.LOGOUT_SUCCESS,
								payload: "none",
							});
							RNRestart.Restart();
						}
					}).done();
				} catch(error) {
					//Re-login with the creds
					console.log("(catch)Error deleting creds, so re-logging in");
					const context = {
						type: START_UP,
						payload: "none",
					};
					_autoLoginWithCreds(context, dispatch);
					console.log("An error occurred removing the creds");
				}
			} else {
				console.error(`Oops! An error occured :( srv_res_status: ${srv_res_status}`);
				dispatch({
					type: actions.LOGOUT_ERROR,
					payload: `Oops! srv_res_status: ${srv_res_status}`,
				});
			}
			
		}
		else {
			if(this.readyState===4) {
				console.error(`An error occured :( ReadyState: ${this.readyState}, Status: ${this.status}`);
				dispatch({
					type: actions.LOGOUT_ERROR,
					payload: `ReadyState: ${this.readyState}, Status: ${this.status}`,
				});
			}	
		}
	};

	xhr.open("POST",`${host}/logout`, true);
	xhr.send();

	dispatch({
		type: actions.IS_LOGGING_OUT,
		payload: "none",
	});
}	


export function fetchMyBooks(dispatch) {
	//Fetches all the books (closest to user's location)
	//Change the url
	let xhr = new XMLHttpRequest();
	xhr.responseType = "text";
	xhr.onreadystatechange = function(){
		if(this.readyState===4 && this.status===200) {
			//console.log(this.responseText);
			let Parser = new DOMParser();
			let xmlDoc = Parser.parseFromString(this.responseText);
			let srv_res_status = parseInt(xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue);
			console.log("Account server response status: "+srv_res_status);

			if(srv_res_status===0) {
				//Success. We have some books. Fetch them into booksArr then change the offSet
				//Extract the books as an object.
				let booksArr = JSON.parse(xmlDoc.getElementsByTagName("bks_info")[0].childNodes[0].nodeValue);

				dispatch({
					type: actions.SUCCESS_FETCHING_MY_BOOKS,
					payload: booksArr, //Array
				});
			} else if(srv_res_status===3) {
				//No results
				console.log("No results");
				dispatch({
					type: actions.ERROR_FETCHING_MY_BOOKS,
					payload: "No results found",
					//TODO NECESSARY: Use status codes depending on the error
				});
			} else if(srv_res_status===9) {
				/*
					User is not logged in. The magic begins. 
					call the create session function. It will check for stored creds, and
					if any, it will log in automatically AND resume the last request. 
					otherwise, it will prompt manual login.
				*/
				console.log("A FAILED REQUEST. NOT LOGGED IN!");
				let context = {
					type: FAILED_REQ,
					payload: {
						dispatcher: (dispatch)=>{
							fetchMyBooks(dispatch);
						},
						arguments: "",
					}
				};
				createSession(
					context,
					dispatch
				);
			} else {
				//An error
				dispatch({
					type: actions.ERROR_FETCHING_MY_BOOKS,
					payload: "Bad server response status.",
				});
			}
		} else {
			//An error occured.
			if(this.readyState===4) {
				console.log("Error fetching.");
				dispatch({
					type: actions.ERROR_FETCHING_MY_BOOKS,
					payload: `Possible internal server error. Status: ${this.status}`,
				});
			}
		}
	};

	try {
		console.log("Trying...");
		xhr.open("POST",`${host}/books/fetch`, true);
		xhr.send();
		dispatch({
			type: actions.IS_FETCHING_MY_BOOKS,
			payload: null,
		});
	}
	catch(error) {
		//If there's an error with connecting to the db, update the state with it.
		console.log("Error connecting to the db: "+error);
		dispatch({
			type: actions.ERROR_FETCHING_MY_BOOKS,
			payload: "Connection or Internal database error.",
		});
	}
}

export function showAddMethodSelectorMenu(dispatch) {
	//Export to slct_bk_add_method.js
	dispatch({
		type: actions.SHOW_METHOD_SELECT_MENU,
		payload: "",
	});
}
export function hideAddMethodSelectorMenu(dispatch){
	//Export to slct_bk_add_method.js
	dispatch({
		type: actions.HIDE_METHOD_SELECT_MENU,
		payload: "",
	});
}

export function getMetaFromIsbn(dispatch, isbn, callback) {
	/**
	 * 1. Check that it's a string.
	 * 2. Check that there aren't any hyphenes
	 * 3. Check if valid isbn10 then 13
	 * if 10, OK. if 13, convert to 10. if invalid isbn, error, enter manually.
	 * Use bookmooch api to get meta data as object
	 */
	if(ISBN.isValidIsbn13(isbn)) {
		//Convert to isbn10
		isbn = ISBN.toIsbn10(isbn);
	} else if(!ISBN.isValidIsbn10(isbn)) {
		//Report reasons and return. RETURN!!
		//Check if it has hyphenes
		if(isbn.includes("-")) {
			dispatch({
				type: actions.ISBN_TO_META_ERROR,
				payload: {
					code: 0,
					msg: "ISBN must not include a hyphene (-)",
				}
			});
			console.log("Invalid isbn. Has -");
			return;
		} else {
			dispatch({
				type: actions.ISBN_TO_META_ERROR,
				payload: {
					code: 0,
					msg: "Invalid ISBN",
				}
			});
			console.log("Invalid isbn");
			return;
		}
	}
	//By this point, the ISBN is solid.
	let xhr = new XMLHttpRequest();
	xhr.responseType = "text";
	xhr.timeout = 5000;
	xhr.ontimeout = function() {
		//Find out the problem
		console.log("Caught a problem with xhr.open()");
		dispatch({
			type: actions.ISBN_TO_META_ERROR,
			payload: {
				code: 1,
				msg: "Request timeout. Check your network",
			}
		});
	};
	xhr.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200) {
			//OK! Proceed to extract data and invoke callback.
			//TODO: PICKUP
			//Network problem??
			const resultObj = JSON.parse(this.responseText);
			if(!resultObj.totalItems) {
				//Problems. No data found
				dispatch({
					type: actions.ISBN_TO_META_ERROR,
					payload: {
						code: 3,
						msg: "No meta data in the database",
					}
				});
			} else {
				//Call the callback.
				console.log(resultObj);
				dispatch({
					type: actions.ISBN_TO_META_SUCCESS,
					payload: {isbn, resultObj:resultObj.items[0].volumeInfo},
				});
				callback(); 
			}
		} else if(this.readyState===4) {
			//Server problem
			console.log("Server Error");
			dispatch({
				type: actions.ISBN_TO_META_ERROR,
				payload: {
					code: 2,
					msg: "Server Error. Try again later!",
				}
			});
		}
	};

	xhr.open("GET", `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyCY-8-Rey7EZEmEacYR0RCMu9KapTItAOU`, true);

	xhr.send();
	dispatch({
		type: actions.ISBN_META_FETCH_START,
		payload: "Fetching meta data",
	});
}

export function submitNewBook(dispatch, data, callback) {
	/**
	 * Error codes: 
	 * 1: Timeout
	 * 2: Network error?
	 * 3: Unknown server error
	 * 4: Failed form validation
	 */
	let fd = new MyFormData();
	let keys = Object.getOwnPropertyNames(data);
	for(let i=0;i<keys.length;i++) {
		fd.append(keys[i], data[keys[i]]);
	}
	//Append current datetime
	fd.append("curr_date_time", getCurrDate());

	let xhr = new XMLHttpRequest();
	xhr.timeout = 10000;
	xhr.ontimeout = function(){
		dispatch({
			type: actions.ADD_BOOK_ERROR,
			payload: {
				errCode: 1,
				errMsg: "Timeout. Network or Server error",
			}
		});
	};
	xhr.responseType = "text";
	xhr.onreadystatechange = function(){
		if(this.readyState===4 && this.status===200) {
			let Parser = new DOMParser();
			let xmlDoc = Parser.parseFromString(this.responseText);

			let srv_res_status = xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue;
			srv_res_status = parseInt(srv_res_status);
			if(srv_res_status===0) {
				/**
				 * Successfully added the book. Display a toast to show for it and
				 * Provide an option to either finish or continue.
				 * Finish should navigate back to MyBooks
				 * Continue should navigate back straight to the scanner
				 */
				dispatch({
					type: actions.ADD_BOOK_SUCCESS,
					payload: null,
				});
				//What better time to call the callback?
				callback();
			} else if(srv_res_status===8) {
				//Failed validation tests
				let errArray = JSON.parse(xmlDoc.getElementsByTagName("err_arr")[0].childNodes[0].nodeValue);
				let err_obj = { /*Reinitialize/empty the previous errors*/
					title: "",
					authors: "",
					edition: "",
					//TODO REQUIRED: Make language input into a select component
					//returning ISO 639-1 Alpha-2 codes
					language: "",
					publisher: "",
					published: "",
					binding: "",
					pages: "",
					isbn: "",//TODO REQUIRED: Autofill ISBN13 in the form
					condition: "",
					location: "",
					description: "",
					offer_expiry: "",
					thumbnail: "",
				};
				for(let i=0; i<errArray.length; i++) {
					err_obj[errArray[i].param] = errArray[i].msg;
				}
				//Dispatch
				dispatch({
					type: actions.ADD_BOOK_ERROR,
					payload: {
						errCode: 4,
						errMsg: err_obj,
					}
				});
			} else {
				//Unknown server error
				dispatch({
					type: actions.ADD_BOOK_ERROR,
					payload: {
						errCode: 3,
						errMsg: "Unknown server error",
					}
				});
			}
		} else {
			//Something happened
			console.log("An error");
			if(this.readyState===4) {
				dispatch({
					type: actions.ADD_BOOK_ERROR,
					payload: {
						errCode: 2,
						errMsg: "Network Error? "
					}
				});
			}
			
		}
	};


	xhr.open("POST", `${host}/books/alter/edit?${fd}`, true);
	xhr.send();
	dispatch({
		type: actions.IS_ADDING_BOOK,
		payload: null,
	});
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
