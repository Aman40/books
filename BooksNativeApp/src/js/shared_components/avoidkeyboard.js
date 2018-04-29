/*This module solves the problem of the keyboard blocking
text input elements. Just wrap your text input component in AvoidKeyboard
and then sit back and enjoy.
You're welcome!
*/
import React, {Component} from 'react'
import {
	View,
	Keyboard,
	Dimensions,
	StyleSheet
} from 'react-native'
export default class AvoidKeyboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			kbdDidShow: false,
			paddedStyle: ""
		}
	}
	componentDidMount=()=>{
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount=()=>{
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	_keyboardDidShow=(e)=>{
		//Get the offset of this very component from the bottom
		//Get the height of the keyboard,
		//Calculate how much padding needs to be added
		//Immediately change the padding
		setTimeout(()=>{
			this.avoidkeyboard.measure((offx, offy, width, height, pgx, pgy)=>{
				let fromBottom = Dimensions.get('window').height - (pgy + height);
				kbd_height = e.endCoordinates.height
				if(kbd_height>fromBottom) {
					//The keyboard is obstructing the input
					//get the original style and adding padding to the bottom
					let btmPadding = kbd_height - fromBottom;
					let paddedStyle = Object.assign({}, StyleSheet.flatten(this.props.style), {
						paddingBottom: btmPadding,
						height: height+btmPadding,
					});
					this.setState({
						kbdDidShow: true,
						paddedStyle: paddedStyle
					});
				}
			})
		}, 0)
	}

	_keyboardDidHide=()=>{
		//Set the style of the component back to the original padding
		this.setState({kbdDidShow: false});
	}
	render() {
		return (
			<View
				style={this.state.kbdDidShow?this.state.paddedStyle:this.props.style}
				ref={view=>{this.avoidkeyboard=view;}} //This isn't working?
			>
				{this.props.children}
			</View>
		)
	}
}
// NOTE: Don't forget to bind functions.
// NOTE: console.log() event listener properties. Helps
