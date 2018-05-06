import React, {Component} from 'react'
import {connect, Provider} from 'react-redux'
import store from '../store'
import {StyleSheet} from 'react-native';

class _BookDetails extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<Text>
					So far, so good!
				</Text>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: '100%',
		padding: 5,
	}
});

//connect it.
function mapStateToProps(state) {
	return {
		book: state.books.booksArr[state.books.clickedOn],
	}
}
function mapDispatchToProps(dispatch) {
	return ({
		check: ()=>{
			console.log("It's dispatching!");
		}
	})
}
const _ConnectedBookDetails = connect(mapStateToProps, mapDispatchToProps)(_BookDetails);



export default class ConnectedBookDetails extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<_ConnectedBookDetails
					navigation={this.props.navigation}
				 />
			</Provider>
		)
	}
}
//Props from the store are passed directly to _ConnectedBookDetails by Provider from the store. Those from navigator have to be passed manually
