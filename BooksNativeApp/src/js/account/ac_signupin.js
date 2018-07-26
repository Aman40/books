/*
This view prompts the user to select sign up 
or sign in. That's all!!
*/
import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import univ_const from "../../../univ_const";

class SignUpIn extends Component {
	constructor(props) {
		super(props);
	}
	navigateToSignUp = ()=>{
		this.props.navigation.navigate("SignUp");
	}
	navigateToSignIn = ()=>{
		this.props.navigation.navigate("SignIn");
	}
	render() {
		return (
			<View style={styles.wrapper}>
				<TouchableOpacity
					accessibilityComponentType="button"
					style = {
						{
							...StyleSheet.flatten(styles.btn),
							width: "80%",
							flexDirection: "row",
							marginBottom: 10,
						}
					}
				>
					<View >
						<Text style={styles.btnText}>
							Sign Up
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={this.navigateToSignIn}
					accessibilityComponentType="button"
					style = {
						{
							...StyleSheet.flatten(styles.btn),
							width: "80%",
							flexDirection: "row",
						}
					}
				>
					<View >
						<Text style={styles.btnText}>
							Sign In
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}
export default SignUpIn;

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {

	},
	btnText: {
		fontSize: 18,
		color: "white",
	},
	btn: {
		backgroundColor: univ_const.alt_theme_color,
		elevation: 10,
		paddingHorizontal: 5,
		paddingVertical: 5,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		height: 40,
	},
});