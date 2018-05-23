import React, {Component} from "react";
import {
	Image,
} from "react-native";

class FlexImage extends Component {
	/*
		Get the source, width, and height of the parent window.
		This fetches the image, measures its dimensions and resizes
		it accordingly.
		this.props.frameWidth,
		this.props.frameHeight,
		this.props.source
	*/
	constructor(props) {
		super(props);
		this.state = {
			style: {
				flex: 1,
				width: undefined,
				height: undefined,

			}
		};
	}
	componentDidMount = ()=>{
		Image.getSize(
			this.props.source,
			(width, height)=>{
				if(width>height) {
					//Landscate
					this.setState({
						style: {
							...this.state.style,

						}
					});
				} else {
					//Portrait or square
				}
			},
			(error)=>{

			});
	}

	render() {
		return (
			<Image
				source={this.props.source}
				resizeMethod={"contain"}
				style={this.state.style}	
			/>
		);
	}
}
export default FlexImage;
