import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ScrollView,
	DatePickerAndroid,
	TouchableOpacity
} from "react-native";
import store from "../store";
import {
	connect,
	Provider,
} from "react-redux";

class _AddBookForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//
			expirydate: "",
		};
	}
	submit = ()=>{
		//Submit the form data
	}
	handleEmailChange=()=>{

	}
	render() {
		return (
			<View style={styles.container}>
				<ScrollView style={{flex: 1}}>	
					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Title:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Authors:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								placeholder={"E.g Aman Haman, Rajesh Kumar, Hay..."}
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Edition:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Language:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Publisher:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Published:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			ISBN 13:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			New:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Condition:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Location:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			I can deliver it:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Description:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.handleEmailChange(text)}
								value={this.state.email}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
			Available Until:
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
											minDate: Date.now(),
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
												this.setState({expirydate: dateString});
											}
										});

									} catch ({code, message}) {
										console.warn("Cannot open date picker", message);
									}
								}}
								style={{flex: 1, alignSelf: "stretch"}}
							>
								<View style={{flex: 1, width: "100%",}}>
									<Text style={styles.dateText} ref={(node)=>{this.datepicker = node;}}>
										{this.state.expirydate?this.state.expirydate:getDefaultExpiryDate()}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>

				</ScrollView>
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
		backgroundColor: "#FBFFC7",
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
	}
});

function mapStateToProps(state){
	//todo
	return {
		todo: "todo",
	};
}
function mapDispatchToProps(dispatch){
	//todo
	return {
		todo: "todo",
	};
}
//connect
const ConnectedAddBookForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(_AddBookForm);
//Provide and export
export default class AddBook extends Component {
	render() {
		return (
			<Provider store={store}>
				<ConnectedAddBookForm
					navigation={this.props.navigation}
				/>
			</Provider>
		);
	}
}

function getDefaultExpiryDate() {  
	let date = new Date(Date.now()+5184000000);
	//YYYY:MM:DD HH:MM:SS Unix datetime string, mysql compatible
	let month = date.getMonth();
	month++; //Javascript month is 0 based. 0=January, 11=December
	if(month<10) {
		month="0"+month.toString();
	}
	let day = date.getDate();
	if(day<10) {
		day="0"+day.toString();
	}
	return `${date.getFullYear()}-${month}-${day}`;
}