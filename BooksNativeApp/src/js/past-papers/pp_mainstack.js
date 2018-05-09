import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text
} from "react-native";
import {StackNavigator} from "react-navigation";

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

export default PastPaperStack = StackNavigator(
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

	}
});
