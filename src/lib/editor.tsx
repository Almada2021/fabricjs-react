import { fabric } from 'fabric'
import { CIRCLE, RECTANGLE, LINE, TEXT, FILL, STROKE, TRIANGLE } from './defaultShapes'
import { useEffect, useState } from 'react'
export interface FabricJSEditor {
  canvas: fabric.Canvas
  addCircle: (circle?: fabric.ICircleOptions) => void
  addRectangle: (rectangle?: fabric.IRectOptions) => void
  addTriangle: (triangle?: fabric.ITriangleOptions) => void
  addLine: () => void
  addText: (text: string, data?: fabric.ITextOptions) => void
  updateText: (text: string) => void
  updateObjects: (text: string, value: any) => void
  deleteAll: () => void
  deleteSelected: () => void
  moveForward: () => void
  toJSON: () => any
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
    addCircle: (prevcircle: fabric.ICircleOptions = CIRCLE) => {
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
      })
      canvas.add(object)
    },
    addTriangle: (triangle: fabric.ITriangleOptions = TRIANGLE) => {
      let total = {
        ...triangle,
      }
      const object = new fabric.Triangle({
        ...total,
        fill: fillColor,
        stroke: strokeColor
      })
      canvas.add(object)
    },
    addRectangle: (rectangle?: fabric.IRectOptions) => {
      let total;
      if (rectangle) {
        total = {...RECTANGLE}
        total = {
          ...rectangle,
        }
      } else {
        total = {
          ...RECTANGLE
        }
      }
      const object = new fabric.Rect({
        ...total,
        fill: fillColor,
        stroke: strokeColor
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
    addText: (text: string, data: fabric.ITextOptions = TEXT) => {
      // use stroke in text fill, fill default is most of the time transparent
      const object = new fabric.Textbox(text, { ...data, fill: strokeColor })
      object.set({ text: text })
      canvas.add(object)
    },
    toJSON: () => {
      return canvas.toJSON();
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
      console.log('Fabric canvas ready')
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
