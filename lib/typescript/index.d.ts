import React from 'react';
import SketchCanvas from './SketchCanvas';
import type { RNSketchCanvasProps, PathData } from './types';
type CanvasState = {
    color: any;
    strokeWidth: any;
    alpha: string;
};
export default class RNSketchCanvas extends React.Component<RNSketchCanvasProps, CanvasState> {
    static defaultProps: {
        containerStyle: null;
        canvasStyle: null;
        onStrokeStart: () => void;
        onStrokeChanged: () => void;
        onStrokeEnd: () => void;
        onClosePressed: () => void;
        onUndoPressed: () => void;
        onClearPressed: () => void;
        onPathsChange: () => void;
        user: null;
        alphlaValues: string[];
        defaultStrokeIndex: number;
        defaultStrokeWidth: number;
        minStrokeWidth: number;
        maxStrokeWidth: number;
        strokeWidthStep: number;
        savePreference: null;
        onSketchSaved: () => void;
        text: null;
        localSourceImage: null;
        permissionDialogTitle: string;
        permissionDialogMessage: string;
    };
    _colorChanged: boolean;
    _strokeWidthStep: any;
    _alphaStep: any;
    _sketchCanvas: any;
    static MAIN_BUNDLE: any;
    static DOCUMENT: any;
    static LIBRARY: any;
    static CACHES: any;
    constructor(props: RNSketchCanvasProps);
    clear(): void;
    undo(): any;
    addPath(data: PathData): void;
    deletePath(id: any): void;
    save(): void;
    getBase64(imageType: string, transparent: boolean, includeImage: boolean, includeText: boolean, cropToImageSize: boolean, callback: () => void): any;
    nextStrokeWidth(): void;
    _renderItem: ({ item, index }: {
        item: any;
        index: any;
    }) => React.JSX.Element;
    componentDidUpdate(): void;
    render(): React.JSX.Element;
}
export { SketchCanvas };
//# sourceMappingURL=index.d.ts.map