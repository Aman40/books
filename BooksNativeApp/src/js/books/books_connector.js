import BooksView from "./books_view";
import {connect} from "react-redux";
import * as dispatchers from "./books_dispatchers";
import store from "../store";
import {Provider} from "react-redux";
import React, {Component} from "react";
import {createSession} from "../account/ac_dispatchers";


function mapStateToProps(state) {
	return {
		books: state.books,
		session: state.session,
		searchMode: state.guiControl.searchMode,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchBooks: (callback)=>{
			dispatchers.fetchBooks(dispatch, callback);
		},
		showItemDetails: (payload)=>{
			dispatchers.showItemDetails(dispatch, payload);
		},
		createSession: (context)=>{
			createSession(context, dispatch);
		}
	};
}
//connect the BooksView to the store
let Connected = connect(mapStateToProps, mapDispatchToProps)(BooksView);
export default class ConnectedBooksView extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<Connected
					navigation={this.props.navigation}
				/>
			</Provider>
		);
	}
}
