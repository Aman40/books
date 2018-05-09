import * as actions from "./ac_actions";
let DOMParser = require("xmldom").DOMParser;
import univ_const from "/var/www/html/books/BooksNativeApp/univ_const.json";
const host = univ_const.server_url;

export function login(dispatch, payload) {
	//Payload must be {email, password}
	let fd = new FormData();
	fd.append("email", payload.email);
	fd.append("password", payload.password);

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
				let user_data = {
					username: "_Aman",
					email: "aman@ham.com",
				};
				console.log(user_data);
				dispatch({
					type: actions.LOGIN_SUCCESS,
					payload: user_data,
				});
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
