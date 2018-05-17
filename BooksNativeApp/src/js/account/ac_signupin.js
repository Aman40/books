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
							width: "80%",
							flexDirection: "row",
							marginBottom: 10,
						}
					}
				>
					<View style={styles.upBtn}>
						<Text style={styles.btnText}>
							Sign Up
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={this.navigateToSignIn}
					accessibilityComponentType="button"
					style={{width: "80%", flexDirection: "row"}}
				>
					<View style={styles.upBtn}>
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
		width: 400,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {

	},
	btnText: {
		fontSize: 18,
		color: "white",
	},
	upBtn: {
		flex: 1,
		backgroundColor: "#007AFF",
		elevation: 5,
		paddingHorizontal: 5,
		paddingVertical: 5,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5
	},
	inBtn: {
		width: 100,
	}
});