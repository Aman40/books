import * as reducers from "./reducers";
import {combineReducers} from "redux";
import {createStore} from "redux";

export default store = createStore(
	combineReducers(
		{
			books: reducers.books,
			myBooks: reducers.myBooks,
			session: reducers.session,
			guiControl: reducers.guiControl,
		}
	)
);
