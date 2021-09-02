import React, {Component} from 'react';
//import react in our code.
import {View, Text, Image, TouchableOpacity} from 'react-native';
//import all the components we are going to use.
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
//import menu and menu item
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default class CustomMenu extends Component {
  _menu = null;
  setMenuRef = (ref) => {
    this._menu = ref;
  };
  showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
  };
  option1Click = () => {
    this._menu.hide();
    this.props.option1Click();
  };
  option2Click = () => {
    this._menu.hide();
    this.props.option2Click();
  };
  option3Click = () => {
    this._menu.hide();
    this.props.option3Click();
  };
  option4Click = () => {
    this._menu.hide();
    this.props.option4Click();
  };
  render() {
    return (
      <View style={this.props.menustyle}>
        <Menu
          ref={this.setMenuRef}
          button={
            <TouchableOpacity onPress={this.showMenu}>
              <Icon name="dots-vertical" size={30} />
            </TouchableOpacity>
          }>
          <MenuItem onPress={this.option1Click}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Icon name="attachment" size={20} />
              <Text style={{marginLeft: 10}}>attachment</Text>
            </View>
          </MenuItem>
          <MenuItem onPress={this.option2Click}>op2:Demo Option</MenuItem>
          <MenuItem onPress={this.option3Click} disabled>
            op3:Disabled option
          </MenuItem>
          <MenuDivider />
          <MenuItem onPress={this.option4Click}>
            op4:Option After Divider
          </MenuItem>
        </Menu>
      </View>
    );
  }
}
