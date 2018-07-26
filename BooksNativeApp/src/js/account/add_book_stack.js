/**
 * Module type: View
 * Purpose: A form for editing or adding new books
 */
import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	DatePickerAndroid,
	TouchableOpacity,
	Picker,
	Alert,
} from "react-native";
import { MyTextInput } from "../shared_components/shared_utilities";
import store from "../store";
import {connect, Provider,} from "react-redux";
//import {objectToString} from "../shared_components/shared_utilities";
import { submitNewBook } from "./ac_dispatchers";
import { langISO6391 } from "../shared_components/shared_utilities";
import Spinner from "react-native-loading-spinner-overlay";


class _AddBookForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//Later on fill with results from scan
			values: {
				title: "",
				authors: "",
				edition: "",
				language: "af",
				publisher: "",
				published: "1900-01-01",
				binding: "",
				pages: "",
				isbn: "",
				condition: "",
				location: "",
				curr_date: getDateAfterMilliseconds(0),
				description: "",
				offer_expiry: getDateAfterMilliseconds(5184000000),
				thumbnail: "",
			},
			errors: {
				title: "",
				authors: "",
				edition: "",
				language: "",
				publisher: "",
				published: "",
				binding: "",
				pages: "",
				isbn: "",
				condition: "",
				location: "",
				curr_date: "",
				description: "",
				offer_expiry: "",
				thumbnail: "",
			}
		};
	}
	componentDidMount=()=>{
		//Initialize
		Object.getOwnPropertyNames(this.props.book).length&&this._init();
	}
	submit = ()=>{
		//Submit the form data
		this.props.submit(this.state.values, (response)=>{
			//Display toast and go back
			console.log("Response: "+JSON.stringify(response));
			if(response===true) {
				console.log("Added book successfully");
				Alert.alert(
					"Hey...",
					"You did great!", 
					//TODO: URGENT: Give reasons for failure
					[
						{text: "OK", onPress: ()=>console.log("OK")}
					],
					{cancelable: true}
				);
				console.log("NAVIGATION PROPS: "+Object.getOwnPropertyNames(this.props.navigation));
				this.props.navigation.goBack(); //Not working.
			} else {
				/**
				 * Alert and do something. Check the store
				 */
				let _failReason = "";
				//Get the reason for failure depending on the store
				switch(this.props.submitStatus.addError.errCode) {
				case 1: //Request Timeout. Network or server error
					_failReason="Request timeout. Not your fault. Try again later.";
					break;
				case 2:
					_failReason = "Network Error. Not your fault. Try again later";
					break;
				case 3:
					_failReason = "A technical problem occurred. Not your fault. Try again later or contact the wizards";
					break;
				case 4:
					_failReason = "Failed validation tests. Your fault. Check the form for details.";
					this.setState({
						errors: (()=>{
							let errs =  {
								...this.state.errors,
								...this.props.submitStatus.addError.errMsg,
							};
							console.log("Errors: "+JSON.stringify(errs));
							return errs;
						})()});
					break;
				default:
				}
				Alert.alert(
					"Error",
					_failReason, 
					//TODO: URGENT: Give reasons for failure
					[
						{text: "OK", onPress: ()=>console.log("OK")}
					],
					{cancelable: true}
				);
			}
		});
	}
	_init=()=>{
		let state_copy;
		//This checks store.booksToAdd.scannedBookMetaObj
		if(Object.getOwnPropertyNames(this.props.book)) {
			console.log(this.props.book);
			state_copy = {
				title: this.props.book.title?this.props.book.title:"",
				authors: this.props.book.authors?this.props.book.authors.toString():"",
				edition: this.props.book.edition?this.props.book.edition:"",
				language: this.props.book.language?this.props.book.language:"",
				publisher: this.props.book.publisher?this.props.book.publisher:"",
				isbn: this.props.book.isbn?this.props.book.isbn:"",
				//TODO. Format the date and find a better default than ""
				published: this.props.book.publishedDate?this.props.book.publishedDate:"", 
				description: this.props.book.description?this.props.book.description:"",
				pages: this.props.book.pageCount?this.props.book.pageCount:"",
				offer_expiry: getDateAfterMilliseconds(5184000000),//2 months from now
				thumbnail: this.props.book.imageLinks?this.props.book.imageLinks.thumbnail:"",
			};
		}
		//TODO: Then set the location as the user's session's university
		state_copy.location = "The University, West of Imre";
		//Then setState()
		this.setState(
			(()=>{
				let new_values = { ...this.state.values, ...state_copy };
				return {values: new_values};
			})());
	}
	render() {
		//Instantiate the loading spinner
		let loadingSpinner = (
			<Spinner 
				visible={true} 
				textContent={"Loading..."} 
				textStyle={{color: "#FFF"}} 
				overlayColor={"rgba(0, 0, 0, 0.5)"}
			/>);
		
		return (
			<View style={styles.container}>
				{this.props.submitStatus.isAddingNewBook&&loadingSpinner}
				<ScrollView style={{flex: 1}}>	
					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Title: <Text style={{color: "red"}}>{this.state.errors.title}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.title.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, title: text };
									return {values: new_values};
								})())}
								value={this.state.values.title}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Authors: <Text style={{color: "red"}}>{this.state.errors.authors}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								placeholder={"E.g Aman Haman, Rajesh Kumar, Hay..."}
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.authors.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, authors: text };
									return {values: new_values};
								})())}
								value={this.state.values.authors}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Pages: <Text style={{color: "red"}}>{this.state.errors.pages}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								keyboardType={"numeric"}
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.pages.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, pages: text };
									return {values: new_values};
								})())}
								value={this.state.values.pages.toString()}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Edition: <Text style={{color: "red"}}>{this.state.errors.edition}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.edition.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, edition: text };
									return {values: new_values};
								})())}
								value={this.state.values.edition}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Language: <Text style={{color: "red"}}>{this.state.errors.language/*RESTART FROM*/}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<Picker
								onValueChange={(val, )=>this.setState((()=>{
									let new_values = { ...this.state.values, language: val };
									return {values: new_values};
								})())}
								selectedValue={this.state.values.language} //TODO LATER: Set default according to user's default language
								style={{
									...StyleSheet.flatten(styles.bindingPicker),
									borderColor: this.state.errors.language.length?
										"red":
										styles.textInput.borderColor,
								}}
								itemStyle={styles.bindingPickerText}
							>
								{(()=>{
									let items=[];
									for(let lab in langISO6391) {
										items.push(
											<Picker.Item key={lab} value={lab} label={langISO6391[lab]}/>
										);
									}
									return items;
								})()}
							</Picker>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Publisher: <Text style={{color: "red"}}>{this.state.errors.publisher/*RESTART FROM*/}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.publisher.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, publisher: text };
									return {values: new_values};
								})())}
								value={this.state.values.publisher}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Published: <Text style={{color: "red"}}>{this.state.errors.published}</Text>
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
													let new_values = { ...this.state.values, published: dateString };
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
									borderColor: this.state.errors.title.length?
										"red":
										"transparent",
								}}
							>
								<View style={{flex: 1, width: "100%",}}>
									<Text style={styles.dateText} ref={(node)=>{this.datepicker = node;}}>
										{this.state.values.published}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Binding: <Text style={{color: "red"}}>{this.state.errors.binding}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<Picker
								onValueChange={(val)=>this.setState((()=>{
									console.log("Selected: "+val);
									let new_values = { ...this.state.values, binding: val };
									return {values: new_values};
								})())}
								selectedValue={this.state.values.binding}
								style={styles.bindingPicker}
								itemStyle={styles.bindingPickerText}
							>
								<Picker.Item label={"Paperback"} value={"paperback"}/>
								<Picker.Item label={"Hardcover"} value={"hardcover"}/>
							</Picker>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					ISBN 13: <Text style={{color: "red"}}>{this.state.errors.isbn}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.isbn.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, isbn: text };
									return {values: new_values};
								})())}
								value={this.state.values.isbn}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Condition: <Text style={{color: "red"}}>{this.state.errors.condition}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.condition.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, condition: text };
									return {values: new_values};
								})())}
								value={this.state.condition}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Location: <Text style={{color: "red"}}>{this.state.errors.location}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.location.length?
										"red":
										styles.textInput.borderColor,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, location: text };
									return {values: new_values};
								})())}
								value={this.state.values.location}
								underlineColorAndroid={"transparent"}
								editable={false}
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
					Description: <Text style={{color: "red"}}>{this.state.errors.description}</Text>
							</Text>
						</View>
						<View style={styles.input}>
							<MyTextInput
								multiline={true}
								style={{
									...StyleSheet.flatten(styles.textInput),
									borderColor: this.state.errors.description.length?
										"red":
										styles.textInput.borderColor,
									height: 105,
								}}
								onChangeText={(text)=>this.setState((()=>{
									let new_values = { ...this.state.values, description: text };
									return {values: new_values};
								})())}
								value={this.state.values.description}
								underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>


					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Available Until: <Text style={{color: "red"}}>{this.state.errors.offer_expiry}</Text>
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
												this.setState((()=>{
													let new_values = { ...this.state.values, offer_expiry: dateString };
													return {values: new_values};
												})());
											}
										});

									} catch ({code, message}) {
										console.warn("Cannot open date picker", message);
									}
								}}
								style={{flex: 1, 
									alignSelf: "stretch",
									borderColor: this.state.errors.title.length?
										"red":
										"transparent",
								}}
							>
								<View style={{flex: 1, width: "100%",}}>
									<Text style={styles.dateText} ref={(node)=>{this.datepicker = node;}}>
										{this.state.values.offer_expiry?this.state.values.offer_expiry:getDateAfterMilliseconds(5184000000)}
									</Text>
								</View>
							</TouchableOpacity>
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
	bindingPicker: {
		flex: 1,
	},
	bindingPickerText: {
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
	}
});

function mapStateToProps(state){
	return {
		book: state.booksToAdd.scannedBookMetaObject,
		submitStatus: state.addNewBook,
		// {
		// 	isAddingNewBook: false,
		// 	addSuccess: false,
		// 	addError: {
		//  * 		errCode: <Number>,
		//  * 		errMsg: if(errCode==4) {
		//  * 					return err_obj<Object>
		// errArr = [{"location":"query","param":"language","value":"","msg":"ER_NO_LANG"},{"location":"query","param":"offer_expiry","value":"","msg":"ER_NO_EXP"}]
		// err_obj = 
		//  * 				} else {
		//  * 					return <String>
		//  * 				}
		//  * 		}
		// }
	};
}
function mapDispatchToProps(dispatch){
	//todo
	return {
		submit: (data, callback)=>{
			submitNewBook(dispatch, data, callback);
		}
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
//2 months = 5184000000
function getDateAfterMilliseconds(milliseconds) {  
	let date = new Date(Date.now()+milliseconds);
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