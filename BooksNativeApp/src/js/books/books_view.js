/*
This module accesses the database to fetch available books and displays them here.
*/
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Button,
} from 'react-native';

export default class BooksView extends Component {
	componentDidMount=()=>{
		//Fetch book data from db. Dispatch action
	};
	componentWillUnmount=()=>{
	}
	render() {
		console.log(Object.getOwnPropertyNames(this.props))
		let innerText = "Initializing. Please wait...";
		//Get the books or error if none.
		if(this.props.books.isFetching) {
			//Display the "wait" spinner
			innerText = "Fetching Books. Please wait...";
			console.log(innerText);
		}
		if(this.props.books.successFetching) {
			//Finished fetching. Check if there are any
			//books.
			innerText = "hasFinished Fetching...";
			console.log(innerText);
			if(this.props.books.booksArr.length>0) {
				//Some books were found
				//Render them in a separate component.
				innerText = `${this.props.books.booksArr.length} books were found.`
				console.log(innerText);
			} else {
				//Report an error.
				innerText = "No books were found. Perhaps if you started working on the server side function responsible...";
				console.log(innerText);
			}
		} else {
			//Error is implied
			innerText = "An error occurred: "+this.props.books.fetchErrorString;
		}
		return (
			<View style={styles.container}>
				<Button
					onPress={this.props.fetchBooks}
					title="Get Books"
				>
					Get Books
				</Button>
				<Text>
					{innerText}
				</Text>
			</View>
		)
	}
}
//Separate module for each book.

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FEFEFE',
	}
});
