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
	ImageBackground,
} from "react-native";
import univ_const from "../../../univ_const.json";
import * as accountDispatchers from "../account/ac_dispatchers";
/*
	//import {objectToString} from "../shared_components/shared_utilities";

	//Call create session with context {type: "START_UP", }
	//Under what if statement and boolean from the store??(state.props.session)
	//Careful not to run into an infinite loop
	//Automatically prompt manual login??
	//If no session and no creds, don't prompt login. Navigate to init. User might not
	//have signed up. Only prompt login if session check was triggered by srv_res_status 9
*/
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
		if(!this.props.searchMode) {
			this.props.fetchBooks();
		}
		//Subscribe to the store for rerenderings whenever the store changes.
	}

	render() {
		console.log(this.props.searchMode?"SEARCH MODE":"NORMAL MODE");
		let books = [];
		//Get the books or error if none.
		if(this.props.searchMode) {
			//Only display results from the search
			//Display all results
			if(this.props.books.isSearching) {
				//Display the "wait" spinner
			}
			if(this.props.books.successSearching) {
				//Finished fetching. Check if there are any
				//books.
				if(this.props.books.searchResultsArr.length>0) {
					//Some books were found
					//Render them in a separate component.
					for(let i=0;i<this.props.books.searchResultsArr.length;i++) {
						books.push(
							<BookView
								showDetails={()=>{
									this.props.showItemDetails(i);
									this.props.navigation.navigate("BookDetails");
								}}
								key={this.props.books.searchResultsArr[i].BookID}
								book={this.props.books.searchResultsArr[i]}
							/>);
					}
				} else {
					//Report an error.
				}
			} else {
				//Error is implied. Shown in modal
			}
		} else {
			//Display all results
			if(this.props.books.isFetching) {
			//Display the "wait" spinner
			}
			if(this.props.books.successFetching) {
			//Finished fetching. Check if there are any
			//books.
				if(this.props.books.booksArr.length>0) {
				//Some books were found
				//Render them in a separate component.
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
					alert.alert(
						"No books!",
						this.props.books.fetchErrorString,
						[{text: "OK", onPress: ()=>console.log("OK")}],
						{cancelable: true}
					);
				}
			} else if(!this.props.isFetching) {
			//Error is implied. Error fetching. Network, server, e.t.c
			//Check in the store's fetchErrorString
			}
		}

		return (
			<View style={styles.container}>
				<ImageBackground
					style={styles.bgImage}
					resizeMode={"cover"}
					source={require("../../images/cat-in-books-7.jpg")}
				>
					<View
						style={{
							flex: 1,
							backgroundColor: "rgba(255,255,255,0.8)",
						}}
					>
						<ScrollView 
							style={styles.scrollview}
							contentContainerStyle={{
								justifyContent:"flex-start",
								alignItems: "stretch"
							}}
						>
							{books}
						</ScrollView>
					</View>
					
				</ImageBackground>
				
			</View>
		);
	}
}
//Separate module for each book.


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
						resizeMode={"contain"}
						style={styles.bk_image}
						source={{uri: (()=>{
							console.log("THUMBNAIL: "+this.props.book.Thumbnail);
							return this.props.book.Thumbnail?
								this.props.book.Thumbnail.replace(/^http:/,"https:"):
								`${host}/images/placeholder.jpg`;
						})()}}
					/>
				</View>
				<View style={styles.bk_contentWrapper}>
					<View style={styles.bk_contentRow}>
						< Text style = {
							{ 
								...StyleSheet.flatten(styles.bk_title),
								color: "black"
							}
						} >
							{this.props.book.Title}
						</Text>
						<Text style={styles.bk_contentValue}>
							by: {this.props.book.Authors}
						</Text>
						<Text style={styles.bk_contentValue}>
							{this.props.book.Language==="english"?"English":"Japanese"}
						</Text>
						<Text style = {
							{ 
								...StyleSheet.flatten(styles.bk_title),
								color: "black"
							}
						} >
							{this.props.book.Binding==="paperback"?"Paperback":"Hardcover"}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "stretch",
		backgroundColor: "#FEFEFE",
	},
	bgImage: {
		flex: 1,
	},
	scrollview: {
		flex: 1,
	},
	bk_wrapper: {
		height: 120,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "stretch",
		paddingVertical: 10,
	},
	bk_imageWrapper: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "flex-start",
	},
	bk_image: {
		flex: 1,
		width: 100,
		height: 100
	},
	bk_contentWrapper: {
		flex: 2,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
		paddingLeft: 10,
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
//TODO: Keep books' history to enable auto fill in future/maintain a catalog of books to
//select from.