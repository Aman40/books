export function objectToString(Obj) {
	/*return value: [string] "property1=<type1>value1, property2=<type2>value2[, ..."
		* The req.session.cookie object doesn't have a toString() method
		* So I'm making my own generic one. It doesn't make prior assumptions
		* about the properties of the object. It, however, only returns a
		* string of enum()-able properties and their values
	* */
	if(!Obj) return "Not an object: Null or undefined.";
	let arr = Object.getOwnPropertyNames(Obj); //Get all the properties
	let returnString = "";
	for(let i=0;i<arr.length-1; i++) {
		returnString+=`${arr[i]}<${typeof(Obj[arr[i]])}> => ${Obj[arr[i]]}, `;	
	}
	return returnString+=`${arr[arr.length-1]}<${typeof(Obj[arr[arr.length-1]])}> =>${Obj[arr[arr.length-1]]}`; //The comma at the end
}
export function getCurrDate() {
	let date = new Date();
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
	let hours = date.getHours();
	if(hours<10) {
		hours="0"+hours.toString();
	}
	let minutes = date.getMinutes();
	if(minutes<10) {
		minutes="0"+minutes.toString();
	}
	let seconds = date.getSeconds();
	if(seconds<10) {
		seconds="0"+seconds.toString();
	}
	return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function MyFormData() {
	this._urlenc = ""; //The URL encoded formdata
	this.append = (key, val)=>{
		if(this._urlenc==="") {
			//The first appending. Don't prepend the "&"
			this._urlenc=`${key}=${val.toString().replace(/&/g, "%26")}`;
		} else {
			this._urlenc+=`&${key}=${val.toString().replace(/&/g, "%26")}`;
		}
	};
	this.toString = ()=>{
		return this._urlenc;
	};
}

export const langISO6391 = {
	af: "Afrikaans",
	ar: "Arabic",
	zh: "Chinese",
	hr: "Croatian",
	cs: "Czech",
	da: "Danish",
	nl: "Dutch",
	en: "English",
	fi: "Finnish",
	fr: "French",
	de: "German",
	el: "Greek",
	hi: "Hindi",
	hu: "Hungarian",
	id: "Indonesian",
	it: "Italian",
	ja: "Japanese",
	ko: "Korean",
	la: "Latin",
	ms: "Malay",
	ne: "Nepali",
	pa: "Panjabi",
	fa: "Persian (Farsi)",
	pl: "Polish",
	pt: "Portuguese",
	ru: "Russian",
	es: "Spanish",
	sw: "Swahili",
	sv: "Swedish",
	th: "Thai",
	tr: "Turkish",
	vi: "Vietnamese",
};

import React, { Component } from "react";
import {
	View,
	Text,
	TouchableWithoutFeedback,
	TextInput,
	StyleSheet,
} from "react-native";

export class MyTextInput extends Component {
	constructor(props) {
		super(props);
		this.state={
			mode: "display", //Other: "edit"
			textIsPlaceholder: !this.props.value,
		};
	}
	_switchToEdit=()=>{
		this.setState({mode: "edit"});
	}
	_switchToDisplay=()=>{
		this.setState({mode: "display"});
	}
	componentDidMount=()=>{
		console.log(Object.getOwnPropertyNames(this));
	}
	//Receives props [value, underlineColorAndroid, onChangeText, style, placeholder]
	render(){
		if(this.state.mode==="display") {
			return (
				<TouchableWithoutFeedback
					onPress={this._switchToEdit}
				>
					<View>
						<Text 
							numberOfLines={this.props.numberOfLines?
								this.props.numberOfLines:
								1}
							style={{
								borderWidth: 1,
								padding: 5,
								borderRadius: 5,
								...StyleSheet.flatten(this.props.style),
								color: (()=>{
									if(!this.props.value) {
										console.log("Is a placeholder");
										//Check if the user provided a custom placeholder color
										//and return it. Else, return the default 
										//(my default for now)
										return this.props.placeholderTextColor?
											this.props.placeholderTextColor:
											"gray";
									} else {
										console.log("Not a placeholder");
										//It's not a placeholder
										//Return the user custom color if any, 
										//Otherwise, use black
										return this.props.color?
											this.props.color:
											"#333";
									}
								})(),
								backgroundColor: "#EEE",
							}}>
							{this.props.value?this.props.value:this.props.placeholder}
						</Text>
					</View>
				</TouchableWithoutFeedback>
			);
		} else { //edit
			return (
				<TextInput 
					{...this.props}
					autoFocus={true}
					style={{
						...StyleSheet.flatten(this.props.style),
					}}
					onEndEditing={this._switchToDisplay}
					onChangeText={this.props.onChangeText?
						(text)=>this.props.onChangeText(text):
						null}
					
				/>
			);
		}
	}
}
