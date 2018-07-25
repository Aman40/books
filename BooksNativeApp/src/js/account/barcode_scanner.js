import React, {Component} from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import {
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native";
import {withNavigation} from "react-navigation";
//import {objectToString} from "../shared_components/shared_utilities";
import { getMetaFromIsbn } from "./ac_dispatchers";
import store from "../store";
import {
	connect,
	Provider
} from "react-redux";
const ISBN = require("simple-isbn").isbn;

class _ScanScreen extends Component {
	onSuccess(e) {
		//Get the meta for each book and put it in the redux store before moving on to the next book
		//Check if this has been scanned before before getting meta data
		if(this.props.scannedIsbnList.includes(e.data)) {
			//Already scanned
			//Display a modal or something.
			Alert.alert(
				"Error",
				"Already scanned that book, idiot!",
				[
					{text: "OK", onPress: ()=>this.scanner&&this.scanner.reactivate()}
				],
				{cancelable: true}
			);
		} else {
			//scan
			this.props.getMetaFromIsbn(e.data, (succeeded)=>{
				if(succeeded) {
					this.props.navigation.navigate("ScanPreview");
				} else {
					//Alert or something
					Alert.alert(
						"Error",
						this.props.errMsg,
						[
							{text: "OK", onPress: ()=>{
								this.props.navigation.goBack();
								this.scanner&&this.scanner.reactivate();
							}}
						],
						{cancelable: false}
					);
				}
			});
		}
		//There should be a waiting system for one to finish before the next
	}

	componentDidUpdate=()=>{
		if(!this.props.wait && !this.props.show && this.props.success) {
			console.log("Reactivating");
			this.scanner&&this.scanner.reactivate();
		}
	}

	render() {
		return (
			<QRCodeScanner
				onRead={this.onSuccess.bind(this)}
				topContent = { 
					<Text style = {
						styles.centerText
					} >
					Go to < Text style = {
							styles.textBold
						} > wikipedia.org / wiki / QR_code </Text> on your computer and scan the QR code. 
					</Text>
				}
				bottomContent={
					<TouchableOpacity
						style={styles.buttonTouchable}
						onPress={()=>{
							console.log(Object.getOwnPropertyNames(this.props.navigation));
							this.props.navigation.pop();
						}}
					>
						<Text style={styles.buttonText}>
							{this.props.wait?"Processing... Wait": "Finish"}
						</Text>
					</TouchableOpacity>
				}
				ref={(node)=>{this.scanner=node;}}
			/>
		);
	}
}

const PreConnScanScreen = withNavigation(_ScanScreen);
function mapStateToProps(state) {
	return {
		wait: state.booksToAdd.fetchingWait,
		success: state.booksToAdd.fetchMetaSuccess,
		error: state.booksToAdd.fetchMetaFail,
		errCode: state.booksToAdd.fetchMetaError.code,
		errMsg: state.booksToAdd.fetchMetaError.msg,
		addedBooks: state.booksToAdd.addedBooksList,
		scannedIsbnList: state.myBooks.isbnList,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		getMetaFromIsbn: (isbn, callback)=>{
			getMetaFromIsbn(dispatch, isbn, callback);
		},
	};
}
const ConnScanScreen = connect(
	mapStateToProps,
	mapDispatchToProps
)(PreConnScanScreen);
export default class ScanScreen extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<ConnScanScreen/>
			</Provider>
		);
	}
}
 
//Define the modal here.



const styles = StyleSheet.create({
	centerText: {
		flex: 1,
		fontSize: 18,
		padding: 32,
		color: "#777",
	},
	textBold: {
		fontWeight: "500",
		color: "#000",
	},
	buttonText: {
		fontSize: 21,
		color: "rgb(0,122,255)",
	},
	buttonTouchable: {
		padding: 16,
	},
});
