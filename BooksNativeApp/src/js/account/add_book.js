import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ScrollView,
	DatePickerAndroid,
	TouchableOpacity,
	Picker,
	ToastAndroid,
} from "react-native";
import store from "../store";
import {connect, Provider,} from "react-redux";
//import {objectToString} from "../shared_components/shared_utilities";
import { submitNewBook } from "./ac_dispatchers";
import { langISO6391 } from "../shared_components/shared_utilities";

class _AddBookForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//Later on fill with results from scan
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
			curr_date: getDateAfterMicroseconds(0),
			description: "",
			offer_expiry: "",
			thumbnail: "",
			Alert,
		};
	}
	componentDidMount=()=>{
		//Initialize
		Object.getOwnPropertyNames(this.props.book).length&&this.init();
	}
	submit = ()=>{
		//Submit the form data
		this.props.submit(this.state, (succeeded)=>{
			//Display toast and go back
			if(succeeded) {
				this.props.navigation.goBack("ScanPreview");
			} else {
				//Alert and do something. Check the store

			}
		});
	}
	init=()=>{
		let state_copy;
		//This checks store.booksToAdd.scannedBookMetaObj
		if(Object.getOwnPropertyNames(this.props.book)) {
			state_copy = {
				title: this.props.book.title?this.props.book.title:"",
				authors: this.props.book.authors.length?this.props.book.authors.toString():"",
				edition: this.props.book.edition?this.props.book.edition:"",
				language: this.props.book.language?this.props.book.language:"",
				publisher: this.props.book.publisher?this.props.book.publisher:"",
				isbn: this.props.book.isbn?this.props.book.isbn:"",
				//TODO. Format the date and find a better default than ""
				published: this.props.book.publishedDate?this.props.book.publishedDate:"", 
				description: this.props.book.description?this.props.book.description:"",
				pages: this.props.book.pageCount?this.props.book.pageCount:"",
				offer_expiry: getDateAfterMicroseconds(5184000000),//2 months from now
				thumbnail: this.props.book.imageLinks.thumbnail?this.props.book.imageLinks.thumbnail:"",
			};
		}
		//TODO: Then set the location as the user's session's university
		state_copy.location = "The University, West of Imre";
		//Then setState()
		this.setState({...this.state, ...state_copy});
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
								onChangeText={(text)=>this.setState({title: text})}
								value={this.state.title}
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
								onChangeText={(text)=>this.setState({authors: text})}
								value={this.state.authors}
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
								onChangeText={(text)=>this.setState({edition: text})}
								value={this.state.edition}
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
							<Picker
								onValueChange={(val, )=>this.setState({language: val})}
								selectedValue={this.state.language} //TODO LATER: Set default according to user's default language
								style={styles.bindingPicker}
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
					Publisher:
							</Text>
						</View>
						<View style={styles.input}>
							<TextInput
								style={styles.textInput}
								onChangeText={(text)=>this.setState({publisher: text})}
								value={this.state.publisher}
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
												this.setState({published: dateString});
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
										{this.state.published}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.inputPromptText}>
					Binding:
							</Text>
						</View>
						<View style={styles.input}>
							<Picker
								onValueChange={(val, )=>this.setState({binding: val})}
								selectedValue={this.state.binding}
								style={styles.bindingPicker}
								itemStyle={styles.bindingPickerText}
							>
								<Picker.Item label={"Paperback"} value={"paper_back"}/>
								<Picker.Item label={"Hardcover"} value={"hard_back"}/>
							</Picker>
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
								onChangeText={(text)=>this.setState({isbn: text})}
								value={this.state.isbn}
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
								onChangeText={(text)=>this.setState({condition: text})}
								value={this.state.condition}
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
								onChangeText={(text)=>this.setState({location: text})}
								value={this.state.location}
								underlineColorAndroid={"transparent"}
								editable={false}
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
								onChangeText={(text)=>this.setState({description: text})}
								value={this.state.description}
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
												this.setState({offer_expiry: dateString});
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
										{this.state.offer_expiry?this.state.offer_expiry:getDateAfterMicroseconds(5184000000)}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>

				</ScrollView>
				<View style={styles.controls}>
					<TouchableOpacity 
						style={styles.cancel} 
						onPress={this.props.navigation.goBack}>
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
function getDateAfterMicroseconds(microseconds) {  
	let date = new Date(Date.now()+microseconds);
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