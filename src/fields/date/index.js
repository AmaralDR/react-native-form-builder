import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text, Icon } from "native-base";
import I18n from "react-native-i18n";
import {
  Platform,
  DatePickerIOS,
  DatePickerAndroid,
  TouchableOpacity,
  TimePickerAndroid
} from "react-native";
import Panel from "../../components/panel";
import moment from "moment";

export default class DatePickerField extends Component {
  static defaultProps = {
    timeZoneOffsetInHours: -1 * (moment().toDate().getTimezoneOffset() / 60)
  };
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    timeZoneOffsetInHours: PropTypes.number,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.onDateChange = this.onDateChange.bind(this);
    this.showTimePicker = this.showTimePicker.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
  }
  onDateChange(date) {
    if (this.props.attributes == "date") {
      this.props.updateValue(
        this.props.attributes.name,
        moment(date).startOf("day")
      );
    } else {
      this.props.updateValue(this.props.attributes.name, date);
    }
  }
  showTimePicker = async stateKey => {
    const { attributes } = this.props;
    const currentDate = attributes.value
      ? moment(attributes.value).toDate()
      : moment().toDate();
    try {
      const { action, minute, hour } = await TimePickerAndroid.open({
        hour: currentDate.getHours(),
        minute: currentDate.getMinutes()
      });
      if (action === TimePickerAndroid.timeSetAction) {
        const date = currentDate;
        date.setHours(hour);
        date.setMinutes(minute);
        this.onDateChange(date);
      }
    } catch ({ code, message }) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };
  showDatePicker = async stateKey => {
    const { attributes } = this.props;
    const currentDate = attributes.value
      ? moment(attributes.value).toDate()
      : moment().toDate();
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: currentDate,
        minDate: attributes.minDate && moment(attributes.minDate).toDate(),
        maxDate: attributes.maxDate && moment(attributes.maxDate).toDate()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        const currentHour = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const date = moment(year, month, day).toDate();
        if (currentHour) {
          date.setHours(currentHour);
        }
        if (currentMinutes) {
          date.setMinutes(currentMinutes);
        }
        this.onDateChange(date);
      }
    } catch ({ code, message }) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };
  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    const value = (attributes.value && moment(attributes.value).toDate()) || null;
    const mode = attributes.mode || "datetime";
    return (
      <View>
        {Platform.OS === "ios" ? (
          <View
            style={{
              backgroundColor: theme.pickerBgColor,
              borderBottomColor: theme.inputBorderColor,
              borderBottomWidth: theme.borderWidth,
              marginHorizontal: 10,
              marginVertical: 0,
              marginLeft: 15
            }}
          >
            <TouchableOpacity
              onPress={() => this.panel.toggle()}
              style={{
                paddingVertical: 10,
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

              <View
                style={{
                  flexDirection: "row"
                }}
              >
                {(mode ? mode === "date" || mode === "datetime" : true) && (
                  <View
                    style={{
                      marginHorizontal: 5
                    }}
                  >
                    <Text>
                      {/* {(value && Moment(value).format(attributes.dataFormat || 'YYYY-MM-DD')) || 'Selecione'} */}
                      {(value &&
                        I18n.strftime(
                          value,
                          attributes.dataFormat || "%d %b %Y"
                        )) ||
                        "Selecione"}
                    </Text>
                  </View>
                )}
                {(mode ? mode === "time" || mode === "datetime" : true) && (
                  <View
                    style={{
                      marginHorizontal: 5
                    }}
                  >
                    <Text>
                      {(value &&
                        I18n.strftime(
                          value,
                          attributes.dataFormat || "%I:%M %p"
                        )) ||
                        "Selecione"}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <ErrorComponent {...{ attributes, theme }} />
            <Panel
              ref={c => {
                this.panel = c;
              }}
            >
              <DatePickerIOS
                date={value || moment().toDate()}
                mode={mode}
                locale={attributes.locale || "pt-br"}
                maximumDate={attributes.maxDate && moment(attributes.maxDate).toDate()}
                minimumDate={attributes.minDate && moment(attributes.minDate).toDate()}
                timeZoneOffsetInMinutes={this.props.timeZoneOffsetInHours * 60}
                onDateChange={this.onDateChange}
              />
            </Panel>
          </View>
        ) : (
          <TouchableOpacity
            onPress={this.showDatePicker}
            style={{
              backgroundColor: theme.pickerBgColor,
              borderBottomColor: theme.inputBorderColor,
              borderBottomWidth: theme.borderWidth,
              marginHorizontal: 10,
              marginVertical: 0,
              paddingVertical: 10,
              marginLeft: 15,
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
            <View
              style={{
                flexDirection: "row"
              }}
            >
              {(attributes.mode === "date" ||
                attributes.mode === "datetime") && (
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, right: 300, left: 50 }}
                  style={{
                    marginHorizontal: 5
                  }}
                >
                  <Text onPress={this.showDatePicker}>
                    {/* {(value && Moment(value).format(attributes.dataFormat || 'YYYY-MM-DD')) || 'Selecione'} */}
                    {(value &&
                      I18n.strftime(
                        value,
                        attributes.dataFormat || "%d %b %Y"
                      )) ||
                      "Selecione"}
                  </Text>
                </TouchableOpacity>
              )}
              {(attributes.mode === "time" ||
                attributes.mode === "datetime") && (
                <TouchableOpacity
                  style={{
                    marginHorizontal: 5
                  }}
                >
                  <Text onPress={this.showTimePicker}>
                    {(value &&
                      I18n.strftime(
                        value,
                        attributes.dataFormat || "%I:%M %p"
                      )) ||
                      "Time"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <ErrorComponent {...{ attributes, theme }} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
