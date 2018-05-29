import React, {Component} from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import {
	Text,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import {withNavigation} from "react-navigation";
import {objectToString} from "../shared_components/shared_utilities";

class _ScanScreen extends Component {
	onSuccess(e) {
		//Data is in e.data. Scrape the web for the meta data
		console.log(objectToString(e));
		console.log("Data: "+e.data);
		this.props.navigation.navigate("Switch");
	}

	render() {
		return (
			<QRCodeScanner
				onRead={this.onSuccess.bind(this)}
				topContent={
					<Text style={styles.centerText}>
Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
					</Text>
				}
				bottomContent={
					<TouchableOpacity style={styles.buttonTouchable}>
						<Text style={styles.buttonText}>OK. Got it!</Text>
					</TouchableOpacity>
				}
			/>
		);
	}
}

const ScanScreen = withNavigation(_ScanScreen);
export default ScanScreen;
   
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