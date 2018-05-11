/*jshint esversion: 6 */
import * as booksActions from "./books_actions";
let DOMParser = require("xmldom").DOMParser;
import univ_const from "/var/www/html/books/BooksNativeApp/univ_const.json";
import * as accountDispatchers from "../account/ac_dispatchers";

const host = univ_const.server_url;

export function fetchBooks(dispatch) {
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
					type: booksActions.SUCCESS_FETCHING_BOOKS,
					payload: booksArr, //Array
				});

				//TODO
			} else if(srv_res_status===1) {
				//No results
				//TODO
			} else if(srv_res_status===9) {
				//User is not logged in. The magic begins. 
				//call the create session function. It will check for stored creds, and
				//if any, it will log in automatically AND resume the last request. 
				//otherwise, it will prompt manual login
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
			}
		} else {
			//An error occured.
			if(this.readyState===4) {
				console.log("Error fetching.");
				dispatch({
					type: booksActions.ERROR_FETCHING,
					payload: `Possible internal server error. Status: ${this.status}`,
				});
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
	}
}

export function showItemDetails(dispatch, payload) {
	dispatch({
		type: booksActions.CLICKED_ITEM,
		payload,
	});
}

function objectToString(Obj) {
	/*return value: [string] "property1=<type1>value1, property2=<type2>value2[, ..."
		* The req.session.cookie object doesn't have a toString() method
		* So I'm making my own generic one. It doesn't make prior assumptions
		* about the properties of the object. It, however, only returns a
		* string of enum()-able properties and their values
	* */
	if(!Obj) return "Not an object: Null or undefined.";
	let arr = Object.getOwnPropertyNames(Obj); //Get all the properties
	let returnString = "";
	for(let i=0;i<arr.length-1; i++) {
		returnString+=`${arr[i]}<${typeof(Obj[arr[i]])}> => ${Obj[arr[i]]}, `;
	}
	return returnString+=`${arr[arr.length-1]}=${Obj[arr[arr.length-1]]}`; //The comma at the end
}
