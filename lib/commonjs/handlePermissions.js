"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestPermissions = void 0;
var _reactNative = require("react-native");
const requestPermissions = async (permissionDialogTitle, permissionDialogMessage) => {
  if (_reactNative.Platform.OS === 'android') {
    const granted = await _reactNative.PermissionsAndroid.request(_reactNative.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
      title: permissionDialogTitle,
      message: permissionDialogMessage,
      buttonPositive: 'OK'
    });
    return granted === _reactNative.PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};
exports.requestPermissions = requestPermissions;
//# sourceMappingURL=handlePermissions.js.map