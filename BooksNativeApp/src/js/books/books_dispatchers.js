import * as booksActions from './books_actions';
let DOMParser = require('xmldom').DOMParser;
let xmlParser = require('react-xml-parser');
export function fetchBooks(dispatch) {
	let xhr = new XMLHttpRequest();
	xhr.responseType = "text";
	xhr.onreadystatechange = function(){
		if(this.readyState===4 && this.status===200) {
			//console.log(this.responseText);
			let Parser = new DOMParser();
			let xmlDoc = Parser.parseFromString(this.responseText);

			let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status')[0].childNodes[0].nodeValue);
			console.log("Server status: "+srv_res_status);

			if(srv_res_status===0) {
				//Success. We have some books. Fetch them into booksArr then change the offSet
				//Extract the books as an object.
				let booksArr = JSON.parse(xmlDoc.getElementsByTagName('bks_info')[0].childNodes[0].nodeValue);

				dispatch({
					type: booksActions.SUCCESS_FETCHING_BOOKS,
					payload: booksArr, //Array
				});

				//TODO
			} else if(srv_res_status===1) {
				//No results
				//TODO
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
				console.log("Error fetching.")
				dispatch({
					type: booksActions.ERROR_FETCHING,
					payload: "Possible internal server error.",
				});
			}
		}
	};

	try {
		console.log("Trying...");
		xhr.open('POST','http://10.4.140.115:8000/books/all', true);
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
	})
}
