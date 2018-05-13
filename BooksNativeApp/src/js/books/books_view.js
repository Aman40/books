/*
This module accesses the database to fetch available books and displays them here.
*/
import React, { Component } from "react";
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
} from "react-native";
import univ_const from "/var/www/html/books/BooksNativeApp/univ_const.json";
import * as accountDispatchers from "../account/ac_dispatchers";

//Call create session with context {type: "START_UP", }
//Under what if statement and boolean from the store??(state.props.session)
//Careful not to run into an infinite loop
//Automatically prompt manual login??
//If no session and no creds, don't prompt login. Navigate to init. User might not
//have signed up. Only prompt login if session check was triggered by srv_res_status 9
const host = univ_const.server_url;
export default class BooksView extends Component {
	componentDidMount=()=>{
		//Fetch book data from db. Dispatch action
		
		if(!this.props.session.isLoggedIn) {
			//If not logged, in, check for stored credentials and login automatically.
			let context = {
				type: accountDispatchers.START_UP,
				payload: null,
			};
			this.props.createSession(context);
		} 
		this.props.fetchBooks();
	}
	componentWillUnmount=()=>{
		//Release resources.
	}
	render() {
		console.log("After mounting, props: "+objectToString(this.props.session));

		let innerText = "Initializing. Please wait...";
		let books = [];
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
				console.log(`There are ${this.props.books.booksArr.length} books.`);
				//Some books were found
				//Render them in a separate component.
				innerText = `${this.props.books.booksArr.length} books by were found.`;
				for(let i=0;i<this.props.books.booksArr.length;i++) {
					books.push(
						<BookView
							showDetails={()=>{
								this.props.showItemDetails(i);
								this.props.navigation.navigate("BookDetails");
							}}
							key={this.props.books.booksArr[i].BookID}
							book={this.props.books.booksArr[i]}
						/>);
				}
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
				<Text>
					{innerText}
				</Text>
				<ScrollView>
					{books}
				</ScrollView>
			</View>
		);
	}
}
//Separate module for each book.

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "#FEFEFE",
	},
	bk_wrapper: {
		width: 400,
		height: 200,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "stretch",
	},
	bk_imageWrapper: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "#000",
	},
	bk_image: {
		flex: 1,
		width: 100,
		height: 100
	},
	bk_contentWrapper: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	bk_contentRow: {
		flex: 1,
	},
	bk_contentLabel: {

	},
	bk_title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	bk_contentValue: {

	}
});

class BookView extends Component {
	//Receives book object as props.
	render() {
		return (
			<TouchableOpacity
				onPress={this.props.showDetails}
				style={styles.bk_wrapper}
			>
				<View style={styles.bk_imageWrapper}>
					<Image
						style={styles.bk_image}
						source={{uri: (()=>{
							return this.props.book.images.length?`${host}/images/`+this.props.book.images[0].ImgID+".jpeg":`${host}/images/placeholder.jpg`;
						})()}}
					/>
				</View>
				<View style={styles.bk_contentWrapper}>
					<View style={styles.bk_contentRow}>
						<Text style={styles.bk_title}>
							{this.props.book.Title}
						</Text>
						<Text style={styles.bk_contentValue}>
							{this.props.book.Authors}
						</Text>
						<Text style={styles.bk_contentValue}>
							{this.props.book.Language}
						</Text>
						<Text style={styles.bk_contentValue}>
							{this.props.book.Publisher}
						</Text>
						<Text style={styles.bk_contentValue}>
							{this.props.book.Published}
						</Text>
						<Text style={styles.bk_contentValue}>
							{"Price: "+this.props.book.Price+" Yen"}
						</Text>
						<Text style={styles.bk_contentValue}>
							{"Pages: "+this.props.book.PageNo}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
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