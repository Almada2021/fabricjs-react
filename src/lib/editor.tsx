import { fabric } from 'fabric'
import { CIRCLE, RECTANGLE, LINE, TEXT, FILL, STROKE, TRIANGLE } from './defaultShapes'
import { useEffect, useState } from 'react'
export interface FabricJSEditor {
  canvas: fabric.Canvas
  addCircle: (circle?: fabric.ICircleOptions, optional?: any) => void
  addRectangle: (rectangle?: fabric.IRectOptions, optional?: any) => void
  addTriangle: (triangle?: fabric.ITriangleOptions, optional?: any) => void
  addLine: () => void
  addText: (text: string, data?: fabric.ITextOptions, optional?: any) => void
  cleanSelection: () => void
  getIndex: (obj: any) => number
  updateText: (text: string) => void
  updateObjects: (text: string, value: any) => void
  deleteAll: () => void
  deleteSelected: () => void
  moveForward: () => void
  loadJSON: (json: any, fn?: Function) => void
  toJSON: (stringArray?: string[]) => any
  fillColor: string
  strokeColor: string
  sendBack: () => void
  setFillColor: (color: string) => void
  setStrokeColor: (color: string) => void
  zoomIn: () => void
  zoomOut: () => void
}

/**
 * Creates editor
 */
const buildEditor = (
  canvas: fabric.Canvas,
  fillColor: string,
  strokeColor: string,
  _setFillColor: (color: string) => void,
  _setStrokeColor: (color: string) => void,
  scaleStep: number
): FabricJSEditor => {
  return {
    canvas,
    addCircle: (prevcircle: fabric.ICircleOptions = CIRCLE, optional = {}) => {
      let circle = {
        ...prevcircle,
        fill: fillColor,
        stroke: strokeColor
      }
      if (!circle.radius) {
        circle.radius = 20
      }
      const object = new fabric.Circle({
        ...circle,
        optional
      })
      canvas.add(object)
    },
    addTriangle: (triangle: fabric.ITriangleOptions = TRIANGLE, optional = {}) => {
      let total = {
        ...triangle,
      }
      const object = new fabric.Triangle({
        ...total,
        fill: fillColor,
        stroke: strokeColor,
        optional
      })
      canvas.add(object)
    },
    addRectangle: (rectangle?: fabric.IRectOptions, optional = {}) => {
      let total;
      if (rectangle) {
        total = { ...RECTANGLE }
        total = {
          ...rectangle,
        }
      } else {
        total = {
          ...RECTANGLE,
        }
      }
      const object = new fabric.Rect({
        ...total,
        fill: fillColor,
        stroke: strokeColor,
        optional
      })
      canvas.add(object)
    },
    addLine: () => {
      const object = new fabric.Line(LINE.points, {
        ...LINE.options,
        stroke: strokeColor
      })
      canvas.add(object)
    },
    addText: (text: string, data: fabric.ITextOptions = TEXT, optional = {}) => {
      // use stroke in text fill, fill default is most of the time transparent
      const object = new fabric.Textbox(text, { ...data, fill: strokeColor, optional })
      object.set({ text: text })
      canvas.add(object)
    },
    cleanSelection: () => {
      canvas.discardActiveObject()
      canvas.renderAll();
    },
    getIndex: (obj: any) => {
      if (obj === null || obj == undefined) {
        return -1;
      }
      const objects: any[] = canvas.getObjects();
      let zIndex = objects.indexOf(obj);
      return zIndex;
    },
    loadJSON: (json: any, fn: Function = () => { console.log("Loaded Json file") }) => {
      canvas.loadFromJSON(json, fn)
    },
    toJSON: (stringArray:string[] = []) => {
      let total;
      if(stringArray?.length > 0){
        total = [...stringArray, "optional"];
      }else{
        total = ["optional"];
      }
      return canvas.toJSON(total);
    },
    moveForward: () => {
      const objects: any[] = canvas.getActiveObjects();
      objects.forEach((e) => {
        canvas.bringForward(e)
      })
      canvas.discardActiveObject()
      canvas.renderAll()

    },

    updateText: (text: string) => {
      const objects: any[] = canvas.getActiveObjects()
      if (objects.length && objects[0].type === TEXT.type) {
        const textObject: fabric.Textbox = objects[0]
        textObject.set({ text })
        canvas.renderAll()
      }
    },

    updateObjects: (text, value) => {
      const objects: any[] = canvas.getActiveObjects();
      const post: any = {
      }
      post[`${text}`] = value
      objects.forEach((element) => {
        element.set({ ...post })

      })
      canvas.renderAll();

    },
    deleteAll: () => {
      canvas.getObjects().forEach((object) => canvas.remove(object))
      canvas.discardActiveObject()
      canvas.renderAll()
    },
    deleteSelected: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object))
      canvas.discardActiveObject()
      canvas.renderAll()
    },
    fillColor,
    sendBack: () => {
      const objects: any[] = canvas.getActiveObjects();
      objects.forEach((e) => {
        canvas.sendToBack(e)
      })
      canvas.discardActiveObject()
      canvas.renderAll()

    },
    strokeColor,
    setFillColor: (fill: string) => {
      _setFillColor(fill)
      canvas.getActiveObjects().forEach((object) => object.set({ fill }))
      canvas.renderAll()
    },
    setStrokeColor: (stroke: string) => {
      _setStrokeColor(stroke)
      canvas.getActiveObjects().forEach((object) => {
        if (object.type === TEXT.type) {
          // use stroke in text fill
          object.set({ fill: stroke })
          return
        }
        object.set({ stroke })
      })
      canvas.renderAll()
    },
    zoomIn: () => {
      const zoom = canvas.getZoom()
      canvas.setZoom(zoom / scaleStep)
    },
    zoomOut: () => {
      const zoom = canvas.getZoom()
      canvas.setZoom(zoom * scaleStep)
    }
  }
}

interface FabricJSEditorState {
  editor?: FabricJSEditor
}

interface FabricJSEditorHook extends FabricJSEditorState {
  selectedObjects?: fabric.Object[]
  onReady: (canvas: fabric.Canvas) => void
}

interface FabricJSEditorHookProps {
  defaultFillColor?: string
  defaultStrokeColor?: string
  scaleStep?: number
}

const useFabricJSEditor = (
  props: FabricJSEditorHookProps = {}
): FabricJSEditorHook => {
  const scaleStep = props.scaleStep || 0.5
  const { defaultFillColor, defaultStrokeColor } = props
  const [canvas, setCanvas] = useState<null | fabric.Canvas>(null)
  const [fillColor, setFillColor] = useState<string>(defaultFillColor || FILL)
  const [strokeColor, setStrokeColor] = useState<string>(
    defaultStrokeColor || STROKE
  )

  const [selectedObjects, setSelectedObject] = useState<fabric.Object[]>([])
  useEffect(() => {
    const bindEvents = (canvas: fabric.Canvas) => {
      var isDragging: boolean = false
      var lastPosX: number;
      var lastPosY: number;
      // var vpt : number[] = []
      // canvas.on('mouse:down', function(opt) {
      // var evt = opt.e;
      // if (evt.altKey === true) {
      // isDragging = true;
      // future improve
      // canvas.selectionDashArray=[]
      // canvas.selection = false;
      // lastPosX = evt.clientX;
      // lastPosY = evt.clientY;
      // }
      // });
      // canvas.on('mouse:move', function(opt) {
      // if (isDragging) {
      // var e = opt.e;
      // if(canvas.viewportTransform){
      // vpt = canvas.viewportTransform;
      // vpt[4] += e.clientX - lastPosX;
      // vpt[5] += e.clientY - lastPosY;

      // }
      // canvas.requestRenderAll();
      // lastPosX = e.clientX;
      // lastPosY = e.clientY;
      // }
      // });
      // canvas.on('mouse:up', function(opt) {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      // canvas.setViewportTransform(vpt);
      // isDragging = false;
      // canvas.selection = true;
      // });

      canvas.on('mouse:wheel', function (opt) {
        let delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      })
      canvas.on('selection:cleared', () => {
        setSelectedObject([])
      })
      canvas.on('selection:created', (e: any) => {
        setSelectedObject(e.selected)
      })
      canvas.on('selection:updated', (e: any) => {
        setSelectedObject(e.selected)
      })
    }
    if (canvas) {
      bindEvents(canvas)
    }
  }, [canvas])

  return {
    selectedObjects,
    onReady: (canvasReady: fabric.Canvas): void => {
      setCanvas(canvasReady)
    },
    editor: canvas
      ? buildEditor(
        canvas,
        fillColor,
        strokeColor,
        setFillColor,
        setStrokeColor,
        scaleStep
      )
      : undefined
  }
}

export { buildEditor, useFabricJSEditor }
export type { FabricJSEditorHook }
