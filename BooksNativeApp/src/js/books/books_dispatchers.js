/*jshint esversion: 6 */
import * as booksActions from "./books_actions";
let DOMParser = require("xmldom").DOMParser;
import univ_const from "../../../univ_const";
import * as accountDispatchers from "../account/ac_dispatchers";
const host = univ_const.server_url;

export function fetchBooks(dispatch, callback) {
	//Fetches all the books (closest to user's location)
	let xhr = new XMLHttpRequest();
	xhr.responseType = "text";
	xhr.timeout = 10000;
	xhr.ontimeout = function(){
		dispatch({
			type: booksActions.ERROR_FETCHING,
			payload: "Request timeout. Check your network.",
		});
		callback(true);
	};
	xhr.onreadystatechange = function(){
		if(this.readyState===4 && this.status===200) {
			//console.log(this.responseText);
			/**
				 * In case the app is behind a captive portal, the portal will respond to the request with
				 * a login page.
				 * The app will try to parse it and fail. That's how we know we're behind a captive portal.
				 * The failure may also be due to a server error but that's a problem that can be eliminated
				 * with good programming.
				 * If the app SOMEHOW manages to parse the response, it should at least fail at finding the
				 * srv_res_status
				 */

			let Parser = new DOMParser({
				locator: {},
				errorHandler: {
					warning: ()=>{
						console.log("Minor problems with your xml");
						dispatch({
							type: booksActions.ERROR_FETCHING,
							payload: "No internet access. Wifi requires log in.",
						});
					},
					error: ()=>{
						console.log("Major problems with your xml");
						dispatch({
							type: booksActions.ERROR_FETCHING,
							payload: "No internet access. Wifi requires log in.",
						});
					}
				}
			});
			let xmlDoc = Parser.parseFromString(this.responseText);
			let srv_res_status;
			try {
				srv_res_status = xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue;
			} catch(e) {
				// console.log("The parser obviously didn't end it: "+e);
				// console.log("callback is: "+typeof(callback));
				callback(true);
				dispatch({
					type: booksActions.ERROR_FETCHING,
					payload: "No internet access. Wifi requires log in yo.",
				});
				// console.log("After dispatching");
				return;
			}
			srv_res_status = parseInt(srv_res_status);

			if(srv_res_status===0) {
				//Success. We have some books. Fetch them into booksArr then change the offSet
				//Extract the books as an object.
				let booksArr = JSON.parse(xmlDoc.getElementsByTagName("bks_info")[0].childNodes[0].nodeValue);

				dispatch({
					type: booksActions.SUCCESS_FETCHING_BOOKS,
					payload: booksArr, //Array
				});
				callback(true);
				//TODO
			} else if(srv_res_status===3) {
				//No results
				console.log("No results for all books");
				dispatch({
					type: booksActions.ERROR_FETCHING,
					payload: "No results",
				});
				callback(true);
			} else if(srv_res_status===9) {
				/*
					User is not logged in. The magic begins. 
					call the create session function. It will check for stored creds, and
					if any, it will log in automatically AND resume the last request. 
					otherwise, it will prompt manual login

					TODO: This will never be applicable here. Logging in is not a requirement.
					Code in this block will,therefore, never run.
					createSession will, however be applicable for other requests for which
					a session is necessary. Especially useful when the session expires and
					the request fails.
				*/
				console.log("A FAILED REQUEST. NOT LOGGED IN!");
				let context = {
					type: accountDispatchers.FAILED_REQ,
					payload: {
						dispatcher: (dispatch)=>{
							fetchBooks(dispatch);
						},
						arguments: "",
					}
				};
				accountDispatchers.createSession(
					context,
					dispatch
				);
			} else {
				//An error
				dispatch({
					type: booksActions.ERROR_FETCHING,
					payload: "Bad server response status.",
				});
				callback(true);
			}
		} else {
			//An error occured.
			if(this.readyState===4) {
				console.log("Error fetching.");
				dispatch({
					type: booksActions.ERROR_FETCHING,
					payload: `Possible internal server error. Status: ${this.status}`,
				});
				callback(true);
			}
		}
	};

	try {
		console.log("Trying...");
		xhr.open("POST",`${host}/books/all`, true);
		xhr.send();
		dispatch({
			type: booksActions.IS_FETCHING_BOOKS,
			payload: null,
		});
	}
	catch(error) {
		//If there's an error with connecting to the db, update the state with it.
		console.log("Error connecting to the db: "+error);
		dispatch({
			type: booksActions.ERROR_FETCHING,
			payload: "Connection or Internal database error.",
		});
		callback(true);
	}
}

export function showItemDetails(dispatch, payload) {
	dispatch({
		type: booksActions.CLICKED_ITEM,
		payload,
	});
}

export function searchBook(dispatch, payload){
	/**
	 * Exported to books_titlebar.js
	 * This searches the database for a specific book title
	 * and returns several books ordered by relevance.
	 * Other possible sorting orders: Price, Closest first
	 * payload should contain the string to be searched.
	 */
	let xhr = new XMLHttpRequest();
	xhr.responseType = "text";
	xhr.timeout = 10000;
	xhr.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200) {
			//OK. Get the srv_res_status
			let Parser = new DOMParser();
			let xmlDoc = Parser.parseFromString(this.responseText);
			let srv_res_status = parseInt(xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue);
			console.log("Account server response status: "+srv_res_status);
			/**
			 * Srv_res_statuses:
			 * 0: Found results
			 * 3: No results
			 * 4: server error
			 * 8: The query failed validation checks. 
			 * Malcious intent or something. 
			 */
			if(srv_res_status===0) {
				//Found results
				console.log("Found results");
				let booksArr = JSON.parse(xmlDoc.getElementsByTagName("bks_info")[0].childNodes[0].nodeValue);

				dispatch({
					type: booksActions.SEARCH_SUCCESS,
					payload: booksArr,
				});
			} else if(srv_res_status===3) {
				//No results
				dispatch({
					type: booksActions.SEARCH_SUCCESS,
					payload: [],
				});
			} else if(srv_res_status===8) {
				//Query failed validation
			} else {
				//No idea what this could be. Dispatch something 
				//for now anyway
				console.log(`Error: srv_res_status: ${srv_res_status}`);
			}
		} else if(this.readyState===4) {
			//Server issues or network.
			console.log("Error fetching.");
			dispatch({
				type: booksActions.SEARCH_ERROR,
				payload: `Possible internal server error. Status: ${this.status}`,
			});
		}
	};
	try {
		xhr.open("POST", `${host}/books/search?query=${payload}`, true);
		xhr.send();
	} catch(err) {
		console.log("Error");
		dispatch({
			type: booksActions.SEARCH_ERROR,
			payload: "Failed to open or send the request."
		});
	}
	dispatch({
		type: booksActions.SEARCH_START,
		payload: null,
	});
}
export function toggleSearchMode(dispatch){
	dispatch({
		type: booksActions.TOGGLE_SEARCH_MODE,
		payload: null,
	});
}