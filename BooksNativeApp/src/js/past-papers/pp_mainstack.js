import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
} from "react-native";
import {StackNavigator} from "react-navigation";

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
});
   
