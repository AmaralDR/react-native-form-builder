import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text, Switch, Icon } from "native-base";

export default class SwitchField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    updateValue: PropTypes.func,
    ErrorComponent: PropTypes.func
  };
  handleChange(value) {
    this.props.updateValue(this.props.attributes.name, value);
  }
  render() {
    const { attributes, theme, ErrorComponent } = this.props;
    return (
      <View>
        <View
          style={{
            backgroundColor: theme.pickerBgColor,
            borderBottomColor: theme.inputBorderColor,
            borderBottomWidth: theme.borderWidth,
            marginHorizontal: 10,
            marginVertical: 0,
            paddingVertical: 10,
            // marginLeft: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start"
              //
            }}
          >
            <Icon
              color={theme.textInputIconColor}
              name={attributes.icon}
              style={attributes.iconStyle}
            />
            <Text
              style={{
                ...attributes.labelStyle,
                ...{ color: theme.labelActiveColor }
              }}
            >
              {attributes.label}
            </Text>
          </View>
          <Switch
            // onTintColor={'blue'}
            onValueChange={value => this.handleChange(value)}
            value={attributes.value}
          />
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}
