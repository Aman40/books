/**
 * The signup component
 * Purporse: It contains the signup form
 * Fields:
 * NameAlias<TextInput>
 * Sex <Selector>
 * DoB <DatePicker>
 * Email <TextInput>
 * pref <Selector>
 * About <TextInput>
 * Student(?) <RadioButton>
 * School <TextInput>
 */
import React, { Component } from "react";
import {
	View,
	StyleSheet,
	Text,
	Alert,
	TouchableOpacity,
	ScrollView,
	Picker,
	DatePickerAndroid,
	TextInput
} from "react-native";
import store from "../store";
import { connect, Provider } from "react-redux";
import {
	submitSignupForm
} from "./ac_dispatchers";
import Spinner from "react-native-loading-spinner-overlay";
// import univ_const from "../../../univ_const";
import { MyTextInput } from "../shared_components/shared_utilities";

class _SignUp extends Component {
	constructor(props){
		super(props);
		this.state={
			values: {
				alias: "",
				sex: "M",
				dob: "1900-01-01",
				email: "",
				pref: "",
				about: "",
				student: false,
				school: "",
				schoolzip: "", //Future proofing
				password1: "",
				password2: ""
			},
			errors: {
				alias: "",
				sex: "",
				dob: "",
				email: "",
				pref: "",
				about: "",
				student: "",
				school: "",
				schoolzip: "",
				password1: "",
			}
		};
	}

	submit = ()=>{
		this.props.submit(this.state.values,
			(success)=>{
				console.log("Either way, done!");
				console.log("Succeeded tho? "+JSON.stringify(success));
				if(success!==false) {
					if(this.props.success) {
						//This likely won't get called because RNRestart.restart()
						//in the dispatcher.
						Alert.alert(
							"Hey",
							"Just wanna let you know that you've successfully signed up.",
							[{text: "OK", onPress: ()=>console.log("OK")}],
							{ cancelable: true }
						);
					} else if(this.props.error.errCode===1) {
						//Timeout
						console.log("Timeout");
					} else if(this.props.error.errCode===2) {
						//Network error or server not running
						console.log("Network error");
					} else if(this.props.error.errCode===3) {
						//Server is running but some error occurred
						console.log("Your server needs help");
						//Unlikely
					} else if(this.props.error.errCode===4) {
						//Failed the for validation. Set state with
						//state.errors equal to the payload
						this.setState({
							...this.state,
							errors: this.props.error.errMsg,
							//errMsg contains an object with the same
							//property names as state.errors
						});
					}
				} else {
					Alert.alert(
						"Oops!",
						this.props.error.msg,
						[{text: "OK", onPress: ()=>console.log("OK")}],
						{ cancelable: true }
					);
				}
			});
	}

	_selectSexMale=()=>{
		let values_copy = {...this.state.values};
		values_copy.sex = "M";
		this.setState({
			values: values_copy
		});
	}

	_selectSexFemale=()=>{
		let values_copy = {...this.state.values};
		values_copy.sex = "F";
		this.setState({
			values: values_copy
		});
	}

	render() {
		//Instantiate the loading spinner
		let loadingSpinner = (
			<Spinner 
				visible={true} 
				textContent={"Signing you up..."} 
				textStyle={{color: "#FFF"}} 
				overlayColor={"rgba(0, 0, 0, 0.5)"}
			/>);
		
		return (
			<View style={styles.container}>
				{this.props.submitting&&loadingSpinner}
				<ScrollView style={{flex: 1}}>	
					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Alias: <Text style={{color: "red"}}>{this.state.errors.alias}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.alias.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, alias: text };
									return {values: new_values};
								})())}
								value={this.state.values.alias}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Sex: <Text style={{color: "red"}}>{this.state.errors.sex}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<Picker
								onValueChange={(val)=>this.setState((()=>{
									console.log("Selected: "+val);
									let new_values = { ...this.state.values, sex: val };
									return {values: new_values};
								})())}
								selectedValue={this.state.values.sex}
								style={styles.sexPicker}
								itemStyle={styles.sexPickerText}
							>
								<Picker.Item label={"Paperback"} value={"paperback"}/>
								<Picker.Item label={"Hardcover"} value={"hardcover"}/>
							</Picker>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					DoB: <Text style={{color: "red"}}>{this.state.errors.dob}</Text>
							</Text>
						</View>
						<View style={styles.datePicker}>
							<TouchableOpacity
								onPress={()=>{
									try {
										DatePickerAndroid.open({
										// Use `new Date()` for current date.
										// May 25 2020. Month 0 is January.
											date: Date.now(),
											minDate: Date.parse("1900-01-01 00:00:00"),
											mode: "default"
										}).then((obj)=>{
											if (obj.action !== DatePickerAndroid.dismissedAction) {
											// Selected year, month (0-11), day
												let month = obj.month;
												month++; //Javascript month is 0 based. 0=January, 11=December
												if(month<10) {
													month="0"+month.toString();
												}
												let day = obj.day;
												if(day<10) {
													day="0"+day.toString();
												}
												let dateString = `${obj.year}-${month}-${day}`;
												this.setState((()=>{
													let new_values = { ...this.state.values, dob: dateString };
													return {values: new_values};
												})());
											}
										});

									} catch ({code, message}) {
										console.warn("Cannot open date picker", message);
									}
								}}
								style={{
									flex: 1, 
									alignSelf: "stretch",
									borderColor: this.state.errors.alias.length?
										"red":
										"transparent",
								}}
							>
								<View style={{flex: 1, width: "100%",}}>
									<Text style={styles.dateText} ref={(node)=>{this.datepicker = node;}}>
										{this.state.values.dob}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Email: <Text style={{color: "red"}}>{this.state.errors.email}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.email.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, email: text };
									return {values: new_values};
								})())}
								value={this.state.values.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Prefecture: <Text style={{color: "red"}}>{this.state.errors.pref}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.pref.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, pref: text };
									return {values: new_values};
								})())}
								value={this.state.values.pref}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={{
						...StyleSheet.flatten(styles.inputGroup),
						height: 140,
					}}>
						<View style={{
							height: 35,
						}}>
							<Text style={styles.inputPromptText}>
					About: <Text style={{color: "red"}}>{this.state.errors.about}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								multiline={true}
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.about?
										"red":
										styles.textInput.borderColor,
									height: 105,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, about: text };
									return {values: new_values};
								})())}
								value={this.state.values.about}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.slctBtn}>
							<View style={styles.leftBtn}>
								<TouchableOpacity
									onPress={()=>{
										console.log("male");
									}}
								>
									<View>
										<Text>
											Male
										</Text>
									</View>
								</TouchableOpacity>
							</View>
							<View style={styles.rightBtn}>
								<TouchableOpacity
									onPress={()=>{
										console.log("Female");
									}}
								>
									<View>
										<Text>
											Female
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					School: <Text style={{color: "red"}}>{this.state.errors.school}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.school.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, school: text };
									return {values: new_values};
								})())}
								value={this.state.values.school}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Password: <Text style={{color: "red"}}>{this.state.errors.password1}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.password1.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, password1: text };
									return {values: new_values};
								})())}
								value={this.state.values.password1}
								underlineColorAndroid={"transparent"}
								secureTextEntry={true}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Confirm Password: <Text style={{color: "red"}}>{}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.values.password1!==this.state.values.password2?
										"red":
										"green",
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, password2: text };
									return {values: new_values};
								})())}
								value={this.state.values.password2}
								underlineColorAndroid={"transparent"}
								secureTextEntry={true}
							/>
						</View>
					</View>


				</ScrollView>
				<View style={styles.controls}>
					<TouchableOpacity 
						style={styles.cancel} 
						onPress={()=>{
							this.props.navigation.goBack();
						}}>
						<Text style={styles.cancelText}>
							Cancel
						</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={styles.submit}
						onPress={this.submit}>	
						<Text style={styles.submitText}>
							Submit
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	inputGroup: {
		height: 75,
		paddingBottom: 5,
	},
	label: {
		flex: 1,
	},
	input: {
		flex: 1,
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
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 10,
		fontSize: 18,
		marginBottom: 10,
	},
	datePicker: {
		flex: 1,
		height: 40,
		justifyContent: "center",
		alignItems: "stretch",
		elevation: 10
	},
	dateText: {
		fontSize: 22,
		color: "rgb(0,122,255)",
	},
	sexPicker: {
		flex: 1,
	},
	sexPickerText: {
		textAlign: "left",
		color: "#777",
		fontSize: 20,
	},
	controls: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	cancel: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	submit: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	cancelText: {
		fontSize: 20,
		color: "rgb(0,122,255)",
		padding: 5,
	},
	submitText: {
		fontSize: 20,
		color: "rgb(0,122,255)",
		padding: 5,
	},
	slctBtn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	leftBtn: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	rightBtn: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	btnText: {
		fontSize: 16,
	}
});

function mapStateToProps(state){
	return {
		submitting: state.signUp.submitting,
		success: state.signUp.success,
		error: state.signUp.error,
		session: state.session,
	};
}

function mapDispatchToProps(dispatch){
	return {
		submit: (data, callback)=>{
			submitSignupForm(dispatch, data, callback);
		}
	};
}

let ConnectedSignupForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(_SignUp);

export default class SignUpForm extends Component {
	render(){
		return(
			<Provider
				store={store}
			>
				<ConnectedSignupForm
					navigation={this.props.navigation}
				/>
			</Provider>
		);
	}
}