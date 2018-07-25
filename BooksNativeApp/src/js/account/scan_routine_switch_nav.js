/**
 * Purpose: Switch navigator for during scanning books. Without this, and using the
 * stack navigator that doesn't provide the option of singleton screens, the stack 
 * ends up filled with multiple barcode scanners, scan previews and edit forms
 * because the three are stacked for each book scanned.
 * Parent: ac_stacknav.js
 * Children: add_book_switch.js, list_book_options.js, barcode_scanner.js, 
 * scanned_preview.js
 */
import React from "react";
import TitleBar from "./titlebar";
import {SwitchNavigator} from "react-navigation";
import ListOptions from "./list_book_options";
import ScanScreen from "./barcode_scanner";
import AddBook from "./add_book_switch";
import ScanPreview from "./scanned_preview";

const ScanRoutine = SwitchNavigator(
	{
		ListOptions: {
			screen: ListOptions,
		},
		BarcodeScanner: {
			screen: ScanScreen,
		},
		EditBook: {
			screen: AddBook
		},
		ScanPreview: {
			screen: ScanPreview,
			navigationOptions: ({navigation, screenProps})=>{
				return {
					header: (headerProps)=>{
						return (<TitleBar
							navigation={navigation}
							screenProps={screenProps}
							headerProps={headerProps}
						/>);
					}
				};
			}
		}
	},
	{
		initialRouteName: "BarcodeScanner",
	}
);

export default ScanRoutine;