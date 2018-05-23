import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	BackHandler
} from "react-native";
import {
	connect,
	Provider,
} from "react-redux";
import store from "../store";
import React, {Component} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {searchBook, toggleSearchMode} from "./books_dispatchers";
//import {objectToString} from "../shared_components/shared_utilities";

class _TitleBar extends Component {
	_hardwareBackPressEvent;
	constructor(props){
		super(props);
		this.state={
			query: "",
		};
	}
	handleTextChange = (text)=>{
		this.setState({
			...this.state,
			query: text,
		});
	}
	handleSearch=()=>{
		//Call the dispatcher with the query
		console.log("Searching for "+this.state.query);
		this.props.searchBook(this.state.query);
	}
	handleFocus=(event)=>{
		/**
		 * 0. If searchMode is off, activate it and using the flag,
		 * 1. Clear the books scrollview container of all the books
		 * 2. Display the close (x) button to toggle back the search mode
		 * 3. disable the fetchBooks function. Have it only called when
		 * 		the mode is off.
		 * 4. Add an event listener to handle the back button to cancel the mode
		 * 5. When the mode is cancelled, clear the store of any search
		 * 		results
		 */
		if(!this.props.searchMode) { //Refocusing in this mode should do nothing
			this.props.toggleSearchMode();
			//Add the back button event listener. But when should it be removed?
			//When the back button is pressed would be ideal. And also when the 
			//mode canceler (x) is pressed. In the first case, it means having the
			//event handler cancel the eventlistner. 
			this._hardwareBackPressEvent = BackHandler.addEventListener("hardwareBackPress",()=>{
				//This callback toggles the mode and removes the listener.
				console.log("Hardware back handler");
				this.props.toggleSearchMode();
				this._hardwareBackPressEvent.remove();
				return true;
			});		
		}
		if(event.nativeEvent.key==="Backspace" && this.state.query==="") {
			//If everything has been erased, toggle the mode 
			//And remove the backpress listener
			if(this.props.searchMode){
				this.props.toggleSearchMode();
				this._hardwareBackPressEvent.remove();
			}
		}
	}
	handleBackButton = ()=>{
		//If guiControl.searchMode: true, disable it upon backbutton
		//press
	}
	render() {
		return (
			<View style={styles.wrapper}>
				<View style={styles.titleTop}>
					<View style={styles.left}>
						< Text style = {
							{
								...StyleSheet.flatten(styles.text),
								color: "black",
							}
						} >
						III
						</Text>
					</View>

					<View style={styles.center}>
						{/*The search bar*/}
						<View style={styles.searchbar}>
							<TextInput
								onKeyPress={(event)=>this.handleFocus(event)}
								style={styles.textinput}
								value={this.state.query}
								onChangeText={(text)=>this.handleTextChange(text)}
								underlineColorAndroid={"transparent"}
								placeholder={"Search for book..."}
							/>
							<View style={styles.submit}>
								<TouchableOpacity
									onPress={this.handleSearch}
								>
									{/*A search button icon*/}
									<Ionicons
										name={"md-search"}
										size={28}
										color={"black"}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<TouchableOpacity
						style={styles.right}
						onPress={this.showMenu}
					>
						<View>
							<Ionicons
								name={"md-menu"}
								size={25}
								color="black"
							/>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.titleBottom}>
					{/*For the filters*/}
					<View style={styles.results_meta}>
						{/*Show number of results and other info bits*/}
						<Text>
							{
								this.props.searchMode?
									"Search for a book":
									this.props.searchStatusMsg
							}
						</Text>
					</View>
					<View style={styles.filter}>
						{/*Show the filter button*/}
						<Text style={{
							fontSize: 18,
						}}>Filter  </Text>
						<Ionicons
							size={25}
							name={"md-arrow-dropdown"}
							color={"black"}
						/>
					</View>
				</View>
			</View>
		);
	}
}
function mapStateToProps(state) {
	return {
		searchStatusMsg: state.books.searchStatusString,
		searchMode: state.guiControl.searchMode,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		searchBook: (payload)=>{
			searchBook(dispatch, payload);
		},
		toggleSearchMode: ()=>{
			toggleSearchMode(dispatch);
		}
	};
}
const ConnectedTitleBar = connect(
	mapStateToProps,
	mapDispatchToProps
)(_TitleBar);
export default class TitleBar extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<ConnectedTitleBar
					navigation={this.props.navigation}
				/>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		justifyContent: "center",
		alignItems: "stretch",
	},
	titleTop: {
		alignSelf: "center",
		height: 56,
		backgroundColor: "teal",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "stretch"
	},
	left: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	center: {
		flex: 4,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	right: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	text: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
	searchbar: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "stretch",
		borderRadius: 10,
		backgroundColor: "lightgray",
		height: 38,
	},
	textinput: {
		flex: 4,
		backgroundColor: "transparent",
		paddingHorizontal: 8,
	},
	submit: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#506060",
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
	},
	titleBottom: {
		alignSelf: "center",
		height: 44,
		backgroundColor: "#eee",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "stretch",
		paddingHorizontal: 10,
	},
	results_meta: {
		flex: 3,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	filter: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderLeftWidth: 1,
		borderLeftColor: "#777"
	}
});
