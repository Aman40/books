import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Linking,
} from "react-native";
import {StackNavigator} from "react-navigation";
import QRCodeScanner from "react-native-qrcode-scanner";

//import MapView from "react-native-maps";
class PastPapersHome extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<View style={styles.wrapper}>
				<Text style={styles.soon}>
					COMING SOON!
				</Text>
				<Text style={styles.text}>
					Hello, its a me! Mario!
				</Text>
				<ScanScreen/>
			</View>
		);
	}
}

const PastPaperStack = StackNavigator(
	{
		PastPapersHome: {
			screen: PastPapersHome,
			navigationOptions: {
				title: "Kakomon",
			}
		}
	},
	{

	}
);
export default PastPaperStack;

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: 400,
		justifyContent: "center",
		alignItems: "center",
	},
	soon: {
		fontSize: 24,
		color: "#3465A4",
		fontWeight: "bold",
	},
	text: {

	},
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


class ScanScreen extends Component {
	onSuccess(e) {
		Linking
			.openURL(e.data)
			.catch(err => console.error("An error occured", err));
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
   
