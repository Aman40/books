/*
This module accesses the database to fetch available books and displays them here.
*/
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';

export default class BooksView extends Component {
	componentDidMount=()=>{
		//Fetch book data from db. Dispatch action
		this.timer = setInterval(()=>{
			console.log("I'm still here!");
		}, 5000)
	};
	componentWillUnmount=()=>{
		clearInterval(this.timer);
	}
	render() {
		return (
			<View style={styles.container}>
				<Text>
					WHY TF DOES THE TEXT KEEP
					MOVING OFF THE SCREEN???
				</Text>
			</View>
		)
	}
}
//Separate module for each book.

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'blue',
	}
});
