import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const PRIMARY_COLOR = 'rgb(0,98,255)';
const WHITE = '#ffffff';
const BORDER_COLOR = '#DBDBDB';

const ActionSheetUpRightCorner = (props) => {
  const { actionItemsUpRightCorner } = props;
  const actionSheetItemsUpRightCorner = [
    ...actionItemsUpRightCorner,
    {
      id: '#cancel',
      label: 'Cancel',
      onPress: props?.onCancel
    }
  ]
  return (
    <View style={styles.modalContent}>
      {
        actionSheetItemsUpRightCorner.map((actionItemUpRightCorner, index) => {
          return (
            <TouchableHighlight
              style={[
                styles.actionSheetView,
                index === 0 && {
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                },
                index === actionSheetItemsUpRightCorner.length - 2 && {
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                },
                index === actionSheetItemsUpRightCorner.length - 1 && {
                  borderBottomWidth: 0,
                  backgroundColor: WHITE,
                  marginTop: 8,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }]}
              underlayColor={'#f7f7f7'}
              key={index} onPress={actionItemUpRightCorner.onPress}
            >
              <Text allowFontScaling={false}
                style={[
                  styles.actionSheetText,
                  props?.actionTextColor && {
                    color: props?.actionTextColor
                  },
                  index === actionSheetItemsUpRightCorner.length - 1 && {
                    color: '#fa1616',
                  }
                ]}>
                {actionItemUpRightCorner.label}
              </Text>
            </TouchableHighlight>
          )
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,
  },
  actionSheetText: {
    fontSize: 18,
    color: PRIMARY_COLOR
  },
  actionSheetView: {
    backgroundColor: WHITE,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_COLOR
  }
});

ActionSheetUpRightCorner.propTypes = {
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      onPress: PropTypes.func
    })
  ).isRequired,
  onCancel: PropTypes.func,
  actionTextColor: PropTypes.string
}


ActionSheetUpRightCorner.defaultProps = {
  actionItems: [],
  onCancel: () => { },
  actionTextColor: null
}


export default ActionSheetUpRightCorner;