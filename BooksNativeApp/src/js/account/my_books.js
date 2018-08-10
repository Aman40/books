import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	TouchableWithoutFeedback,
	RefreshControl,
	// Alert,
} from "react-native";
import {connect, Provider} from "react-redux";
import store from "../store";
import {
	fetchMyBooks,
	showAddMethodSelectorMenu,
	showItemDetails,
	pullDatabaseChanges
} from "./ac_dispatchers";
import univ_const from "../../../univ_const";
import { langISO6391 } from "../shared_components/shared_utilities";
const host = univ_const.server_url;
//import {objectToString} from "../shared_components/shared_utilities";
import Ionicons from "react-native-vector-icons/Ionicons";
import MethodSelectorMenu from "./slct_bk_add_method";
// import Spinner from "react-native-loading-spinner-overlay";


class _MyBooks /*to ac_tabnav.js*/ extends Component {
	constructor(props){
		super(props);
		this.state = {
			refreshing: false,
			loading: false, //For the loading screen
		};
	}
	componentDidMount = ()=>{
		console.log("Mounting my books");
		this._refresh();
	}
	_refresh=()=>{
		this.setState({refreshing: false, loading: true});
		this.props.fetchMyBooks((finished)=>{
			if(finished){
				//Do something
			} else {
				//Alert an error or something
			}
			this.setState({
				refreshing: false,
				loading: false,
			});
		});
	}

	componentDidUpdate=()=>{
		//Refetch items if the store refresh bit (bool) is turned on.
		//Then turn it off
		console.log("I updated");
		if(this.props.pullChanges) {
			//The databse has been updated
			console.log("Refreshing");
			this._refresh();
			console.log("Flipping the switch");
			this.props.pullDbChanges();
		} else {
			console.log("Nothing changed, no refreshing");
		}
		console.log("Done update routine");
	}
	_onRefresh=(finished)=>{
		this.setState({refreshing: true});
		this.props.fetchMyBooks(()=>{
			console.log("Done fetching my books");
			if(finished){
				//Alert or something
			} else {
				//Alert an error or something
			}
			this.setState({
				refreshing: false,
				loading: false,
			});
		});
	}

	render() {
		//Instantiate the loading spinner
		let loadingSpinner = null;
		//BUG: Upon signing in, this loading spinner is displayed despite the 
		//Component not even being mounted! The console.log doesn't even appear!
		// if(this.state.loading) {
		// 	console.log("Loading = "+this.state.loading);
		// 	loadingSpinner = (
		// 		<Spinner 
		// 			visible={this.state.loading} //Dirty trick 
		// 			textContent={"Loading my_books..."} 
		// 			textStyle={{color: "#FFF"}} 
		// 			overlayColor={"rgba(0, 0, 0, 0.5)"}
		// 		/>);
		// }
		

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
		} else if(this.props.books.fetchErrorString) {
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
				{loadingSpinner}
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
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh}
						/>
					}
				>
					{books.length?books: null}
				</ScrollView>
			</View>
		);
	}
}

class BookView extends Component {
	//Receives book object as props.
	render() {
		return (
			<TouchableWithoutFeedback
				style={styles.bk_wrapper}
				onPress={this.props.showDetails}
			>
				<View style={{
					flex: 1,
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "stretch",
					paddingVertical: 10,
				}}>
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
							< Text style = {{ 
								...StyleSheet.flatten(styles.bk_title),
								color: "black"
							}}
							numberOfLines={1}
							>
								{this.props.book.Title}
							</Text>
							<Text style={styles.bk_contentValue} numberOfLines={1}>
								by: {this.props.book.Authors}
							</Text>
							<Text style={styles.bk_contentValue} numberOfLines={1}>
								{langISO6391[this.props.book.Language]}
							</Text>
							<Text style = {{ 
								color: "black"
							}}
							numberOfLines={1}	
							>
								{this.props.book.Binding==="paperback"?"Paperback":"Hardcover"}
							</Text>
							<Text style={styles.bk_contentValue} numberOfLines={1}>
								{"Pages: "+this.props.book.PageNo}
							</Text>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "stretch",
		backgroundColor: "#FFF",
	},
	scrollview: {
		flex: 1,
		paddingTop: 10,
	},
	bk_wrapper: {
		height: 120,
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
		flex: 2,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
		padding: 10,
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
		backgroundColor: "#EEE",
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
		pullChanges: state.myBooks.shouldPullDB,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		fetchMyBooks: (callback)=>fetchMyBooks(dispatch, callback),
		showMenu: ()=>showAddMethodSelectorMenu(dispatch),
		showItemDetails: (i)=>showItemDetails(dispatch, i),
		pullDbChanges: ()=>{
			pullDatabaseChanges(dispatch);
		}
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