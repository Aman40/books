/**
 * Purpose: After scanning a book's barcode and fetching the meta data, sometimes
 * multiple results are returned in an array. As of 2018/07/25T17:09 JST, I select
 * the first item on the list, i.e array[0] and assume that's correct.
 * Desired behavior is to display the options to the user in this component and 
 * give them the option to select the right book IF and WHEN multiple results are
 * returned.
 */
import React, { Component } from "react";
import {
	View
} from "react-native";

export default class ListOptions extends Component {
	render(){
		return (
			<View>

			</View>
		);
	}
}