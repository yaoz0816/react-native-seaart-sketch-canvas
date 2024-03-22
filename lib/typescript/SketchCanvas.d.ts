import React from 'react';
import type { SketchCanvasProps, CanvasText, PathData, Path } from './types';
type CanvasState = {
    text: any;
};
declare class SketchCanvas extends React.Component<SketchCanvasProps, CanvasState> {
    static defaultProps: {
        style: null;
        strokeColor: string;
        strokeWidth: number;
        onPathsChange: () => void;
        onStrokeStart: (_x: number, _y: number) => void;
        onStrokeChanged: () => void;
        onStrokeEnd: () => void;
        onSketchSaved: () => void;
        user: null;
        touchEnabled: boolean;
        text: null;
        localSourceImage: null;
        permissionDialogTitle: string;
        permissionDialogMessage: string;
    };
    _pathsToProcess: Path[];
    _paths: Path[];
    _path: PathData | null;
    _handle: any;
    _screenScale: number;
    _offset: {
        x: number;
        y: number;
    };
    _size: {
        width: number;
        height: number;
    };
    _initialized: boolean;
    panResponder: any;
    state: {
        text: null;
    };
    static MAIN_BUNDLE: any;
    static DOCUMENT: any;
    static LIBRARY: any;
    static CACHES: any;
    constructor(props: SketchCanvasProps);
    _processText(text: any): any;
    getProcessedText: (text: CanvasText[] | undefined) => any;
    clear(): void;
    undo(): number;
    addPath(data: Path): void;
    deletePath(id: any): void;
    save(imageType: string, transparent: boolean, folder: string, filename: string, includeImage: boolean, includeText: boolean, cropToImageSize: boolean): void;
    getPaths(): Path[];
    getBase64(imageType: string, transparent: boolean, includeImage: boolean, includeText: boolean, cropToImageSize: boolean, callback: () => void): void;
    componentDidMount(): Promise<void>;
    render(): React.JSX.Element;
}
export default SketchCanvas;
//# sourceMappingURL=SketchCanvas.d.ts.map