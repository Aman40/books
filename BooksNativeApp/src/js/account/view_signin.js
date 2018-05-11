import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
	Button,
	TextInput,
} from "react-native";
import store from "../store";
import {connect, Provider} from "react-redux";
import * as ac_dispatchers from "./ac_dispatchers";

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
				/>
				<Button
					onPress={this.submit}
					title={"Submit"}
					style={styles.submitButton}
				/>
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
	submitButton: {
		marginTop: 20,
	}
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
				navigation={this.props.navigation}
			>
				<_ConnectedSignIn/>
			</Provider>
		);
	}
}
