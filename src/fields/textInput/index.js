import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Item, Input, Icon, ListItem, Text } from 'native-base';
import { Platform } from 'react-native';
import { getKeyboardType } from '../../utils/methods';

export default class TextInputField extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    updateValue: PropTypes.func,
    onSummitTextInput: PropTypes.func,
    ErrorComponent: PropTypes.func,
  }
  handleChange(text) {
    this.props.updateValue(this.props.attributes.name, text);
  }
  formatMask(text, mask) {
    var re = /^\d+$/;
    var texto = text
    if(mask){
      var retorno = '';
      var index = 0;
      // Fazer um loop no texto pegando apenas numeros
      for (var i = 0; i < mask.length; i++){
        if(re.test(texto[i])){
          if (re.test(mask[index])) {
            retorno = retorno + texto[i];
          }else{
            retorno = retorno + mask[index];
            retorno = retorno + texto[i];
            index = index + 1;
          }
          index = index + 1;
        }
      }
      return retorno.toString();
    }else{
      return text.toString();
    }
  }

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    const inputProps = attributes.props;
    const keyboardType = getKeyboardType(attributes.type);
    return (
      <ListItem style={{ borderBottomWidth: 0, paddingVertical: 5 }}>
        <View style={{ flex: 1 }}>
          <View>
            <Item error={theme.changeTextInputColorOnError ? attributes.error : null}>
              { attributes.icon &&
              <Icon color={theme.textInputIconColor} name={attributes.icon} style={attributes.iconStyle} />
                }
              <Input
                style={{
                  height: inputProps && inputProps.multiline && (Platform.OS === 'ios' ? undefined : null),
                  padding: 0,
                }}
                ref={(c) => { this.textInput = c; }}
                underlineColorAndroid="transparent"
                numberOfLines={3}
                secureTextEntry={attributes.secureTextEntry || attributes.type === 'password'}
                placeholder={attributes.label}
                blurOnSubmit={false}
                onSubmitEditing={() => this.props.onSummitTextInput(this.props.attributes.name)}
                placeholderTextColor={theme.inputColorPlaceholder}
                editable={attributes.editable}
                value={attributes.value && this.formatMask(attributes.value, attributes.inputMask)}
                keyboardType={keyboardType}
                onChangeText={(text) => {
                  var re = /^\d+$/;
                  var texto = text
                  //var mask = '000.000.000-00';
                  if(attributes.inputMask){
                    var mask = attributes.inputMask;
                    var retorno = '';
                    var index = 0;
                    // Fazer um loop no texto pegando apenas numeros
                    //element
                    for (var i = 0; i < mask.length; i++){
                      if(re.test(texto[i])){
                        if (re.test(mask[index])) {
                          //console.log(`key: ${i} || value: ${texto[i]}`);
                          retorno = retorno + texto[i];
                        }else{
                          //console.log(`NaN key: ${i} || value: ${mask[index]}`);
                          retorno = retorno + mask[index];
                          retorno = retorno + texto[i];
                          index = index + 1;
                        }
                        index = index + 1;
                      }
                    }
                    //console.log(retorno);
                    if(retorno.length <= mask.length){
                      this.handleChange(retorno);
                      this.setState({ text: retorno});

                    }

                  }else{
                    this.handleChange(text);
                    this.setState({ text: text});
                  }
                }}
                //value={this.state.text}
                //onChangeText={text => this.handleChange(text)}
                {...inputProps}
              />
              { theme.textInputErrorIcon && attributes.error ?
                <Icon name={theme.textInputErrorIcon} /> : null}
            </Item>
          </View>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </ListItem>
    );
  }
}