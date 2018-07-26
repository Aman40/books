import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
	// Button,
	TextInput,
	TouchableOpacity
} from "react-native";
import store from "../store";
import {connect, Provider} from "react-redux";
import * as ac_dispatchers from "./ac_dispatchers";
import { MyTextInput } from "../shared_components/shared_utilities";
import univ_const from "../../../univ_const";

class _SignIn extends Component {
	constructor(props) {
		super(props);
		this.state={
			email: "",
			password: "",
		};
	}
	handleEmailChange = (text)=>{
		this.setState({
			email: text,
		});
	}
	handlePasswordChange = (text)=>{
		this.setState({password: text});
	}
	submit = ()=>{
		this.props.submitCreds({
			email: this.state.email,
			password: this.state.password,
		});
	}
	render() {
		/*
			Navigate to the home screen upon completion of the login. 
			Use the login: successful flag (isLoggedIn)
		*/
		if(this.props.session.isLoggedIn) {
			//Navigate to the referrer view.
			this.props.navigation.navigate("AccountHome");
		}
		return (
			<View style={styles.wrapper}>
				<Text
					style={styles.inputPromptText}
				>
					Email
				</Text>
				<TextInput
					style={styles.textInput}
					onChangeText={(text)=>this.handleEmailChange(text)}
					value={this.state.email}
				/>
				<Text
					style={styles.inputPromptText}
				>
					Password
				</Text>
				<TextInput
					style = {
						{ ...StyleSheet.flatten(styles.textInput),
							marginBottom: 20
						}
					}
					onChangeText={(text)=>this.handlePasswordChange(text)}
					secureTextEntry={true}
					value={this.state.password}
					underlineColorAndroid={"transparent"}
				/>
				<TouchableOpacity
					onPress={this.submit}
					accessibilityComponentType="button"
					style={styles.btn}
				>
					<View >
						<Text style={styles.btnText}>
							Submit
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "stretch",
		paddingHorizontal: 10,
		width: "100%",
	},
	inputPromptText: {
		textAlign: "left",
		color: "#777",
		fontSize: 20,
	},
	textInput: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 5,
		backgroundColor: "white",
		paddingHorizontal: 10,
		fontSize: 18,
		marginBottom: 10,
	},
	btn: {
		flexDirection: "row",
		backgroundColor: univ_const.alt_theme_color,
		elevation: 10,
		paddingHorizontal: 5,
		paddingVertical: 5,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		height: 40,
	},
	btnText: {
		fontSize: 18,
		color: "white",
	},
});

function mapStateToProps(state) {
	return {
		session: state.session,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		submitCreds: (payload)=>{
			ac_dispatchers.login(dispatch, payload);
		}
	};
}

const _ConnectedSignIn = connect(
	mapStateToProps,
	mapDispatchToProps
)(_SignIn);

export default class SignIn extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<_ConnectedSignIn
					navigation={this.props.navigation}
				/>
			</Provider>
		);
	}
}
