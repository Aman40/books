import React, {Component} from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import {
	Text,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import {withNavigation} from "react-navigation";
import {objectToString} from "../shared_components/shared_utilities";
import { getMetaFromIsbn } from "./ac_dispatchers";
import store from "../store";
import {
	connect,
	Provider
} from "react-redux";

class _ScanScreen extends Component {
	onSuccess(e) {
		//Data is in e.data. Scrape the web for the meta data
		//Use this api: "http://api.bookmooch.com/api/asin?asins=4563022373&inc=Edition+ISBN+Binding+Title+Author+NumberOfPages+Publisher+PublicationDate&o=json"
		//Only replacing the isbn after conversion to ISBN-10
		//Get the meta for each book and put it in the redux store before moving on to the next book
		this.props.getMetaFromIsbn(e.data);
		//There should be a waiting system for one to finish before the next
	}

	render() {
		console.log(objectToString(this.props.addedBooks[0]));
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
						onPress={()=>this.props.navigation.navigate("Switch")}
					>
						<Text style={styles.buttonText}>{this.props.wait?"Wait": "Ready"}</Text>
					</TouchableOpacity>
				}
				reactivate={true}
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
	};
}
function mapDispatchToProps(dispatch) {
	return {
		getMetaFromIsbn: (isbn)=>{
			getMetaFromIsbn(dispatch, isbn);
		}
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