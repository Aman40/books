import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	// Alert,
} from "react-native";
import {connect, Provider} from "react-redux";
import store from "../store";
import {
	fetchMyBooks,
	showAddMethodSelectorMenu,
	showItemDetails,
} from "./ac_dispatchers";
import univ_const from "../../../univ_const.json";
const host = univ_const.server_url;
//import {objectToString} from "../shared_components/shared_utilities";
import Ionicons from "react-native-vector-icons/Ionicons";
import MethodSelectorMenu from "./slct_bk_add_method";

class _MyBooks /*to ac_tabnav.js*/ extends Component {
	componentDidMount = ()=>{
		this.props.fetchMyBooks();
	}

	render() {
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
				<View style={styles.controls}>
					<TouchableOpacity 
						style={styles.addbk}
						onPress={this.props.showMenu}
					>
						<Ionicons
							name={"md-add-circle"}
							size={28}
							color={"#333"}
						/>
						{this.props.show&&<MethodSelectorMenu/>}
					</TouchableOpacity>
					<View style={styles.filterbks}>
						<Text>Filter</Text>
					</View>
				</View>
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
				style={styles.bk_wrapper}
				onPress={this.props.showDetails}
			>
				<View style={styles.bk_imageWrapper}>
					<Image
						resizeMode={"contain"}
						style={styles.bk_image}
						source={{uri: (()=>{
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
							{this.props.book.Cover==="paper_back"?"Paperback":"Hardcover"}
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
		paddingTop: 10,
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
		backgroundColor: "white",
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

	},
	wrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "gray",

	},
	controls: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#DDD",
		height: 44,
	},
	addbk: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	filterbks: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		borderLeftWidth: 1,
		borderLeftColor: "#AAA",
	},
});


function mapStateToProps(state) {
	//TODO
	return {
		books: state.myBooks,
		show: state.guiControl.showBookAddMethodSelectorMenu,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		fetchMyBooks: ()=>fetchMyBooks(dispatch),
		showMenu: ()=>showAddMethodSelectorMenu(dispatch),
		showItemDetails: ()=>showItemDetails(dispatch),
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
				<ConnectedMyBooks
					navigation={this.props.navigation}
				/> 
			</Provider>
		);
	}
}
/*navigator can be passed with "withNavigator from react-redux"*/
/**
 * TODO: URGENT IDEA
 * 0. Use the camera to get metadata by scanning the barcode
 * 1. Use a camera to capture the books' pictures,
 * 2. Use the camera to scan class notes
 * 3. Compete the universities against each other
 * 4. Monetize by giving extra memory
 * 5. Monetize by asking for donations
 * 6. Monetize by giving privacy? (Github style)
 */