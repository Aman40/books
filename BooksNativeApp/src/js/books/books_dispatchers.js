import * as booksActions from './books_actions'
export function fetchBooks(dispatch) {
	let xhr = new XMLHttpRequest();
	xhr.responseType = "document";
	xhr.onreadystatechange = function(){
		console.log("Ready state: "+this.readyState);
		console.log("Status: "+this.status);
		if(this.readyState===4 && this.status===200) {

			let xmlDoc = this.responseXML;
			let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status'));

			if(srv_res_status===0) {
				//Success. We have some books. Fetch them into booksArr then change the offSet
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
		xhr.open('POST','http://localhost:8000/books/fetch', true);
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
