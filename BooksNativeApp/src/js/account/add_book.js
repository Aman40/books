import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ScrollView
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
		};
	}
	submit = ()=>{
		//Submit the form data
	}
	handleEmailChange=()=>{

	}
	render() {
		return (
			<ScrollView style={styles.container}>	

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
					<View style={styles.input}>
						<TextInput
							style={styles.textInput}
							onChangeText={(text)=>this.handleEmailChange(text)}
							value={this.state.email}
							underlineColorAndroid={"transparent"}
						/>
					</View>
				</View>

			</ScrollView>
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
		borderBottomColor: "#AAA",
		borderBottomWidth: 1,
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