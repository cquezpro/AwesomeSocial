import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'
import propTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 18,
    width: 34,
  },
})

const BaseIcon = ({ containerStyle, icon }) => (
  <View style={[styles.container, containerStyle]}>
    <Icon
      size={24}
      color="white"
      type="material"
      name="notifications"
      {...icon}
    />
  </View>
)

BaseIcon.propTypes = {
  containerStyle: propTypes.oneOfType([propTypes.object, propTypes.number]),
  icon: propTypes.object,
  iconStyle: propTypes.oneOfType([propTypes.object, propTypes.number]),
}

BaseIcon.defaultProps = {
  containerStyle: {},
  icon: {},
  iconStyle: {},
}

export default BaseIcon
