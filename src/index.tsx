import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import SketchCanvas from './SketchCanvas';
import type {RNSketchCanvasProps, PathData} from './types';

type CanvasState = {
  color: any;
  strokeWidth: any;
  alpha: string;
};

function generateUniqueFilename() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      // eslint-disable-next-line no-bitwise
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      // eslint-disable-next-line no-bitwise
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
}

export default class RNSketchCanvas extends React.Component<
  RNSketchCanvasProps,
  CanvasState
> {
  static defaultProps = {
    containerStyle: null,
    canvasStyle: null,
    onStrokeStart: () => {},
    onStrokeChanged: () => {},
    onStrokeEnd: () => {},
    onClosePressed: () => {},
    onUndoPressed: () => {},
    onClearPressed: () => {},
    onPathsChange: () => {},
    user: null,
    alphlaValues: ['33', '77', 'AA', 'FF'],
    defaultStrokeIndex: 0,
    defaultStrokeWidth: 3,

    minStrokeWidth: 3,
    maxStrokeWidth: 15,
    strokeWidthStep: 3,

    savePreference: null,
    onSketchSaved: () => {},

    text: null,
    localSourceImage: null,

    permissionDialogTitle: '',
    permissionDialogMessage: '',
  };

  _colorChanged: boolean;
  _strokeWidthStep: any;
  _alphaStep: any;
  _sketchCanvas: any;
  static MAIN_BUNDLE: any;
  static DOCUMENT: any;
  static LIBRARY: any;
  static CACHES: any;

  constructor(props: RNSketchCanvasProps) {
    super(props);

    this.state = {
      color: props.strokeColors?.[props?.defaultStrokeIndex || 0]?.color,
      strokeWidth: props.defaultStrokeWidth,
      alpha: 'FF',
    };

    this._colorChanged = false;
    this._strokeWidthStep = props.strokeWidthStep;
    this._alphaStep = -1;
  }

  clear() {
    this._sketchCanvas.clear();
  }

  undo() {
    return this._sketchCanvas.undo();
  }

  addPath(data: PathData) {
    this._sketchCanvas.addPath(data);
  }

  deletePath(id: any) {
    this._sketchCanvas.deletePath(id);
  }

  save() {
    if (this.props.savePreference) {
      const p = this.props.savePreference();
      this._sketchCanvas.save(
        p.imageType,
        p.transparent,
        p.folder ? p.folder : '',
        p.filename,
        p.includeImage !== false,
        p.includeText !== false,
        p.cropToImageSize || false,
      );
    } else {
      this._sketchCanvas.save(
        'png',
        false,
        '',
        generateUniqueFilename(),
        true,
        true,
        false,
      );
    }
  }

  getBase64(
    imageType: string,
    transparent: boolean,
    includeImage: boolean,
    includeText: boolean,
    cropToImageSize: boolean,
    callback: () => void,
  ) {
    return this._sketchCanvas.getBase64(
      imageType,
      transparent,
      includeImage,
      includeText,
      cropToImageSize,
      callback,
    );
  }

  nextStrokeWidth() {
    if (
      (this.state.strokeWidth >= (this.props.maxStrokeWidth || 0) &&
        this._strokeWidthStep > 0) ||
      (this.state.strokeWidth <= (this.props.minStrokeWidth || 0) &&
        this._strokeWidthStep < 0)
    ) {
      this._strokeWidthStep = -this._strokeWidthStep;
    }
    this.setState({
      strokeWidth: this.state.strokeWidth + this._strokeWidthStep,
    });
  }

  _renderItem = ({item, index}: {item: any; index: any}) => (
    <TouchableOpacity
      style={{marginHorizontal: 2.5}}
      onPress={() => {
        if (this.state.color === item.color) {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const index = this.props.alphlaValues.indexOf(this.state.alpha);
          if (this._alphaStep < 0) {
            this._alphaStep = index === 0 ? 1 : -1;
            this.setState({
              alpha: this.props.alphlaValues[index + this._alphaStep]!,
            });
          } else {
            this._alphaStep =
              index === this.props.alphlaValues.length - 1 ? -1 : 1;
            this.setState({
              alpha: this.props.alphlaValues[index + this._alphaStep]!,
            });
          }
        } else {
          this.setState({color: item.color});
          this._colorChanged = true;
        }
      }}>
      {this.state.color !== item.color &&
        this.props.strokeComponent &&
        this.props.strokeComponent(item.color)}
      {this.state.color === item.color &&
        this.props.strokeSelectedComponent &&
        this.props.strokeSelectedComponent(
          item.color + this.state.alpha,
          index,
          this._colorChanged,
        )}
    </TouchableOpacity>
  );

  componentDidUpdate() {
    this._colorChanged = false;
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        <SketchCanvas
          ref={ref => (this._sketchCanvas = ref)}
          style={this.props.canvasStyle}
          strokeColor={
            this.state.color +
            (this.state.color.length === 9 ? '' : this.state.alpha)
          }
          onStrokeStart={this.props.onStrokeStart}
          onStrokeChanged={this.props.onStrokeChanged}
          onStrokeEnd={this.props.onStrokeEnd}
          user={this.props.user}
          strokeWidth={this.state.strokeWidth}
          onSketchSaved={(success, path) =>
            this.props.onSketchSaved?.(success, path)
          }
          onPathsChange={this.props.onPathsChange}
          text={this.props.text}
          localSourceImage={this.props.localSourceImage}
          permissionDialogTitle={this.props.permissionDialogTitle}
          permissionDialogMessage={this.props.permissionDialogMessage}
        />
      </View>
    );
  }
}

RNSketchCanvas.MAIN_BUNDLE = SketchCanvas.MAIN_BUNDLE;
RNSketchCanvas.DOCUMENT = SketchCanvas.DOCUMENT;
RNSketchCanvas.LIBRARY = SketchCanvas.LIBRARY;
RNSketchCanvas.CACHES = SketchCanvas.CACHES;

export {SketchCanvas};