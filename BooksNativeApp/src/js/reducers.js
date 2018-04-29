import * as booksActions from './books/books_actions'

export function books(
	state={
		startedFetching: false,
		finishedFetching: false,
		error: {
			hasError: false,
			errorString: null,
		},
		offSet: 0, //From the start
		count: 50, //Fetch 50 at a time
		booksArr: [{}],
	},action
) {
	switch (action.type) {
		case booksActions.FETCH_BOOKS:
			let newState = {...state};
			let xhr = new XMLHTTPRequest();
			xhr.responseType = "document";
			xhr.onReadyStateChange = ()=>{
				if(this.state===4 && this.status===200) {

					let xmlDoc = this.responseXML;
					let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status'));

					if(srv_res_status===0) {
						//Success. We have some books. Fetch them into booksArr then change the offSet
						newState.offset += 50;
					} else if(srv_res_status===1) {
						//No results
					} else {
						newState.error.hasError = true;
					}
				} else {
					//An error occured.
					newState.error.hasError = true;
				}
			};

			try {
				xhr.open('POST','http://localhost:8000/books/fetch', true);
				xhr.send();
				newState.startedFetching = true;
			}
			catch(error) {
				newState.error.hasError = true;
				newState.errorString = "Connection or Internal database error";
				newState.startedFetching = false;
			}
			return newState;
			break;
		default:
			return state;
	}
}
