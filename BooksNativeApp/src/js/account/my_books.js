import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
} from "react-native";
import {connect, Provider} from "react-redux";
import store from "../store";
import {fetchMyBooks} from "./ac_dispatchers";
import univ_const from "/var/www/html/books/BooksNativeApp/univ_const.json";
const host = univ_const.server_url;
import {objectToString} from "../shared_components/shared_utilities";

class _MyBooks /*to ac_tabnav.js*/ extends Component {
	componentDidMount = ()=>{
		this.props.fetchMyBooks();
	}

	render() {
		console.log(objectToString(this.props));
		let books = [];
		let errReport = "";
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
				errReport = (
					<View>
						<Text>
								No books found.
						</Text>
					</View>
				);
			}
		} else {
			//Error is implied
			errReport = (
				<View>
					<Text>
							Implied Error: {this.props.books.fetchErrorString}
					</Text>
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<ScrollView 
					style={styles.scrollview}
					contentContainerStyle={{
						justifyContent:"flex-start",
						alignItems: "stretch"
					}}
				>
					{books.length?books: errReport}
				</ScrollView>
			</View>
		);
	}
}

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
							{this.props.book.Cover==="paper_back"?"Paperback":"Hardcover"}
						</Text>
						<Text style = {
							{ 
								...StyleSheet.flatten(styles.bk_title),
								color: "red",
								fontSize: 16,
							}
						} >
							{"JPY "+this.props.book.Price}
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
	scrollview: {
		flex: 1,
	},
	bk_wrapper: {
		height: 144,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "stretch",
	},
	bk_imageWrapper: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		backgroundColor: "white",
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

	},
	wrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "gray",

	}
});


function mapStateToProps(state) {
	//TODO
	return {
		books: state.myBooks,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		fetchMyBooks: ()=>fetchMyBooks(dispatch),
	};
}
let ConnectedMyBooks = connect(
	mapStateToProps,
	mapDispatchToProps
)(_MyBooks);

export default class MyBooks extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<ConnectedMyBooks/> 
			</Provider>
		);
	}
}
/*navigator can be passed with "withNavigator from react-redux"*/