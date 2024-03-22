'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _memoizeOne = _interopRequireDefault(require("memoize-one"));
var _react = _interopRequireDefault(require("react"));
var _reactNative = _interopRequireWildcard(require("react-native"));
var _handlePermissions = require("./handlePermissions");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SketchViewName = 'RNSketchCanvas';
const RNSketchCanvas = (0, _reactNative.requireNativeComponent)(SketchViewName);
const SketchCanvasManager = _reactNative.NativeModules.RNSketchCanvasManager || {};
class SketchCanvas extends _react.default.Component {
  static defaultProps = {
    style: null,
    strokeColor: '#000000',
    strokeWidth: 3,
    onPathsChange: () => {},
    onStrokeStart: (_x, _y) => {},
    onStrokeChanged: () => {},
    onStrokeEnd: () => {},
    onSketchSaved: () => {},
    user: null,
    touchEnabled: true,
    text: null,
    localSourceImage: null,
    permissionDialogTitle: '',
    permissionDialogMessage: ''
  };
  state = {
    text: null
  };
  constructor(props) {
    super(props);
    this._pathsToProcess = [];
    this._paths = [];
    this._path = null;
    this._handle = null;
    this._screenScale = _reactNative.Platform.OS === 'ios' ? 1 : _reactNative.PixelRatio.get();
    this._offset = {
      x: 0,
      y: 0
    };
    this._size = {
      width: 0,
      height: 0
    };
    this._initialized = false;
    this.panResponder = _reactNative.PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (_evt, _gestureState) => true,
      onStartShouldSetPanResponderCapture: (_evt, _gestureState) => true,
      onMoveShouldSetPanResponder: (_evt, _gestureState) => true,
      onMoveShouldSetPanResponderCapture: (_evt, _gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        var _this$props$onStrokeS, _this$props;
        if (!this.props.touchEnabled) {
          return;
        }
        const e = evt.nativeEvent;
        this._offset = {
          x: e.pageX - e.locationX,
          y: e.pageY - e.locationY
        };
        this._path = {
          id: parseInt(String(Math.random() * 100000000), 10),
          color: this.props.strokeColor,
          width: this.props.strokeWidth,
          data: []
        };
        _reactNative.UIManager.dispatchViewManagerCommand(this._handle, _reactNative.UIManager.getViewManagerConfig(RNSketchCanvas).Commands.newPath, [this._path.id, (0, _reactNative.processColor)(this._path.color), this._path.width ? this._path.width * this._screenScale : 0]);
        _reactNative.UIManager.dispatchViewManagerCommand(this._handle, _reactNative.UIManager.getViewManagerConfig(RNSketchCanvas).Commands.addPoint, [parseFloat((Number((gestureState.x0 - this._offset.x).toFixed(2)) * this._screenScale).toString()), parseFloat((Number((gestureState.y0 - this._offset.y).toFixed(2)) * this._screenScale).toString())]);
        const x = parseFloat((gestureState.x0 - this._offset.x).toFixed(2)),
          y = parseFloat((gestureState.y0 - this._offset.y).toFixed(2));
        this._path.data.push(`${x},${y}`);
        (_this$props$onStrokeS = (_this$props = this.props).onStrokeStart) === null || _this$props$onStrokeS === void 0 || _this$props$onStrokeS.call(_this$props, x, y);
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (!this.props.touchEnabled) {
          return;
        }
        if (this._path) {
          var _this$props$onStrokeC, _this$props2;
          _reactNative.UIManager.dispatchViewManagerCommand(this._handle, _reactNative.UIManager.getViewManagerConfig(RNSketchCanvas).Commands.addPoint, [parseFloat((Number((gestureState.moveX - this._offset.x).toFixed(2)) * this._screenScale).toString()), parseFloat((Number((gestureState.moveY - this._offset.y).toFixed(2)) * this._screenScale).toString())]);
          const x = parseFloat((gestureState.moveX - this._offset.x).toFixed(2)),
            y = parseFloat((gestureState.moveY - this._offset.y).toFixed(2));
          this._path.data.push(`${x},${y}`);
          (_this$props$onStrokeC = (_this$props2 = this.props).onStrokeChanged) === null || _this$props$onStrokeC === void 0 || _this$props$onStrokeC.call(_this$props2, x, y);
        }
      },
      onPanResponderRelease: (_evt, _gestureState) => {
        if (!this.props.touchEnabled) {
          return;
        }
        if (this._path) {
          var _this$props$onStrokeE, _this$props3;
          (_this$props$onStrokeE = (_this$props3 = this.props).onStrokeEnd) === null || _this$props$onStrokeE === void 0 || _this$props$onStrokeE.call(_this$props3, {
            path: this._path,
            size: this._size,
            drawer: this.props.user
          });
          this._paths.push({
            path: this._path,
            size: this._size,
            drawer: this.props.user
          });
        }
        _reactNative.UIManager.dispatchViewManagerCommand(this._handle, _reactNative.UIManager.getViewManagerConfig(RNSketchCanvas).Commands.endPath, []);
      },
      onShouldBlockNativeResponder: (_evt, _gestureState) => {
        return true;
      }
    });
  }
  _processText(text) {
    text && text.forEach(t => t.fontColor = (0, _reactNative.processColor)(t.fontColor));
    return text;
  }
  getProcessedText = (0, _memoizeOne.default)(text => {
    const textCopy = text ? text.map(t => Object.assign({}, t)) : null;
    return this._processText(textCopy);
  });
  clear() {
    this._paths = [];
    this._path = null;
    _reactNative.UIManager.dispatchViewManagerCommand(this._handle, _reactNative.UIManager.getViewManagerConfig(RNSketchCanvas).Commands.clear, []);
  }
  undo() {
    let lastId = -1;
    this._paths.forEach(d => lastId = d.drawer === this.props.user ? d.path.id : lastId);
    if (lastId >= 0) {
      this.deletePath(lastId);
    }
    return lastId;
  }
  addPath(data) {
    if (this._initialized) {
      if (this._paths.filter(p => p.path.id === data.path.id).length === 0) {
        this._paths.push(data);
      }
      const pathData = data.path.data.map(p => {
        const coor = p.split(',').map(pp => parseFloat(pp).toFixed(2));
        return `${coor[0] * this._screenScale * this._size.width / data.size.width},${coor[1] * this._screenScale * this._size.height / data.size.height}`;
      });
      _reactNative.UIManager.dispatchViewManagerCommand(this._handle, _reactNative.UIManager.getViewManagerConfig(RNSketchCanvas).Commands.addPath, [data.path.id, (0, _reactNative.processColor)(data.path.color), data.path.width ? data.path.width * this._screenScale : 0, pathData]);
    } else {
      this._pathsToProcess.filter(p => p.path.id === data.path.id).length === 0 && this._pathsToProcess.push(data);
    }
  }
  deletePath(id) {
    this._paths = this._paths.filter(p => p.path.id !== id);
    _reactNative.UIManager.dispatchViewManagerCommand(this._handle, _reactNative.UIManager.getViewManagerConfig(RNSketchCanvas).Commands.deletePath, [id]);
  }
  save(imageType, transparent, folder, filename, includeImage, includeText, cropToImageSize) {
    _reactNative.UIManager.dispatchViewManagerCommand(this._handle, _reactNative.UIManager.getViewManagerConfig(RNSketchCanvas).Commands.save, [imageType, folder, filename, transparent, includeImage, includeText, cropToImageSize]);
  }
  getPaths() {
    return this._paths;
  }
  getBase64(imageType, transparent, includeImage, includeText, cropToImageSize, callback) {
    if (_reactNative.Platform.OS === 'ios') {
      SketchCanvasManager.transferToBase64(this._handle, imageType, transparent, includeImage, includeText, cropToImageSize, callback);
    } else {
      _reactNative.NativeModules.SketchCanvasModule.transferToBase64(this._handle, imageType, transparent, includeImage, includeText, cropToImageSize, callback);
    }
  }
  async componentDidMount() {
    await (0, _handlePermissions.requestPermissions)(this.props.permissionDialogTitle || '', this.props.permissionDialogMessage || '');
  }
  render() {
    return /*#__PURE__*/_react.default.createElement(RNSketchCanvas, _extends({
      ref: ref => {
        this._handle = _reactNative.default.findNodeHandle(ref);
      },
      style: this.props.style,
      onLayout: e => {
        this._size = {
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height
        };
        this._initialized = true;
        this._pathsToProcess.length > 0 && this._pathsToProcess.forEach(p => this.addPath(p));
      }
    }, this.panResponder.panHandlers, {
      onChange: e => {
        if (e.nativeEvent.hasOwnProperty('pathsUpdate')) {
          var _this$props$onPathsCh, _this$props4;
          (_this$props$onPathsCh = (_this$props4 = this.props).onPathsChange) === null || _this$props$onPathsCh === void 0 || _this$props$onPathsCh.call(_this$props4, e.nativeEvent.pathsUpdate);
        } else if (e.nativeEvent.hasOwnProperty('success') && e.nativeEvent.hasOwnProperty('path')) {
          var _this$props$onSketchS, _this$props5;
          (_this$props$onSketchS = (_this$props5 = this.props).onSketchSaved) === null || _this$props$onSketchS === void 0 || _this$props$onSketchS.call(_this$props5, e.nativeEvent.success, e.nativeEvent.path);
        } else if (e.nativeEvent.hasOwnProperty('success')) {
          var _this$props$onSketchS2, _this$props6;
          (_this$props$onSketchS2 = (_this$props6 = this.props).onSketchSaved) === null || _this$props$onSketchS2 === void 0 || _this$props$onSketchS2.call(_this$props6, e.nativeEvent.success, '');
        }
      },
      localSourceImage: this.props.localSourceImage,
      permissionDialogTitle: this.props.permissionDialogTitle,
      permissionDialogMessage: this.props.permissionDialogMessage,
      text: this.getProcessedText(this.props.text)
    }));
  }
}
const ViewManager = _reactNative.UIManager.getViewManagerConfig(RNSketchCanvas);
SketchCanvas.MAIN_BUNDLE = _reactNative.Platform.OS === 'ios' ? ViewManager.Constants.MainBundlePath : '';
SketchCanvas.DOCUMENT = _reactNative.Platform.OS === 'ios' ? ViewManager.Constants.NSDocumentDirectory : '';
SketchCanvas.LIBRARY = _reactNative.Platform.OS === 'ios' ? ViewManager.Constants.NSLibraryDirectory : '';
SketchCanvas.CACHES = _reactNative.Platform.OS === 'ios' ? ViewManager.Constants.NSCachesDirectory : '';
var _default = exports.default = SketchCanvas;
//# sourceMappingURL=SketchCanvas.js.map