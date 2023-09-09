import { useEffect, useState } from 'react'
import { FabricJSCanvas, useFabricJSEditor } from './lib'

function App() {
  const { selectedObjects, editor, onReady} = useFabricJSEditor({
    defaultStrokeColor: 'red'
  })
  const [text, setText] = useState('')
  const [strokeColor, setStrokeColor] = useState('')
  const [fillColor, setFillColor] = useState('')
  const testCanvas = {
    "version": "5.3.0",
    "objects": [
      {
        "type": "rect",
        "version": "5.3.0",
        "originX": "left",
        "originY": "top",
        "left": 488,
        "top": 114,
        "width": 80,
        "height": 80,
        "fill": "rgb(255,255,255,1)",
        "stroke": "#000000",
        "strokeWidth": 1,
        "strokeDashArray": null,
        "strokeLineCap": "butt",
        "strokeDashOffset": 0,
        "strokeLineJoin": "miter",
        "strokeUniform": false,
        "strokeMiterLimit": 4,
        "scaleX": 11.17,
        "scaleY": 6.3,
        "angle": 0,
        "flipX": false,
        "flipY": false,
        "opacity": 1,
        "shadow": null,
        "visible": true,
        "backgroundColor": "",
        "fillRule": "nonzero",
        "paintFirst": "fill",
        "globalCompositeOperation": "source-over",
        "skewX": 0,
        "skewY": 0,
        "rx": 0,
        "ry": 0
      },
      {
        "type": "rect",
        "version": "5.3.0",
        "originX": "left",
        "originY": "top",
        "left": 490,
        "top": 321,
        "width": 80,
        "height": 80,
        "fill": "rgb(255,0,0,1)",
        "stroke": "#000000",
        "strokeWidth": 1,
        "strokeDashArray": null,
        "strokeLineCap": "butt",
        "strokeDashOffset": 0,
        "strokeLineJoin": "miter",
        "strokeUniform": false,
        "strokeMiterLimit": 4,
        "scaleX": 11.15,
        "scaleY": 3.77,
        "angle": 0,
        "flipX": false,
        "flipY": false,
        "opacity": 1,
        "shadow": null,
        "visible": true,
        "backgroundColor": "",
        "fillRule": "nonzero",
        "paintFirst": "fill",
        "globalCompositeOperation": "source-over",
        "skewX": 0,
        "skewY": 0,
        "rx": 0,
        "ry": 0
      },
      {
        "type": "rect",
        "version": "5.3.0",
        "originX": "left",
        "originY": "top",
        "left": 495,
        "top": 120,
        "width": 80,
        "height": 80,
        "fill": "#00f",
        "stroke": "#000000",
        "strokeWidth": 1,
        "strokeDashArray": null,
        "strokeLineCap": "butt",
        "strokeDashOffset": 0,
        "strokeLineJoin": "miter",
        "strokeUniform": false,
        "strokeMiterLimit": 4,
        "scaleX": 2.47,
        "scaleY": 2.47,
        "angle": 0,
        "flipX": false,
        "flipY": false,
        "opacity": 1,
        "shadow": null,
        "visible": true,
        "backgroundColor": "",
        "fillRule": "nonzero",
        "paintFirst": "fill",
        "globalCompositeOperation": "source-over",
        "skewX": 0,
        "skewY": 0,
        "rx": 0,
        "ry": 0
      }
    ]
  }

  // editor?.loadJSON(testCanvas, () => {
  //   console.log("Ready")
  // })
  const onAddCircle = () => {
    editor?.addCircle()
  }
  const onAddTriangle = () => {
    editor?.addTriangle()
  }
  const onAddRectangle = () => {
    editor?.addRectangle()
  }
  const onAddLine = () => {
    editor?.addLine()
  }
  const onAddText = () => {
    if (selectedObjects?.length) {
      return editor?.updateText(text)
    }
    editor?.addText(text)
  }
  const onSetStrokeColor = () => {
    editor?.setStrokeColor(strokeColor)
  }
  const onSetFillColor = () => {
    editor?.setFillColor(fillColor)
  }
  const onDeleteAll = () => {
    editor?.deleteAll()
  }
  const onDeleteSelected = () => {
    editor?.deleteSelected()
  }
  const onZoomIn = () => {
    editor?.zoomIn()
  }
  const onZoomOut = () => {
    editor?.zoomOut()
  }
  const reJSON = () => {
    // editor?.moveForward();
    let q = editor?.toJSON();
    console.log(q)
  }
  const testActive = () => {
    editor?.sendBack();

  }
  const clicked = (e: any) => {
    editor?.addTriangle({ left: e.clientX - 20, top: e.clientY - 130, width: 80, height: 80, angle: 0 }, {queso: "perro"})
    // editor?.addText("Add Text", {
    //   type: 'text',
    //   left: e.clientX - 20, top: e.clientY - 130, fontSize: 16,
    //   fontFamily: 'Arial',
    // })
  }
  // console.log(editor?.getIndex(selectedObjects ? selectedObjects[0] : null))
  return (
    <>
      {editor ? (
        <div>
          <button onClick={onZoomIn}>Zoom In</button>
          <button onClick={onZoomOut}>Zoom Out</button>
          <button onClick={onAddCircle}>Add circle</button>
          <button onClick={onAddRectangle}>Add Rectangle</button>
          <button onClick={onAddTriangle}>Add Triangle</button>
          <button onClick={onAddLine}>Add Line</button>
          <button onClick={onDeleteAll}>Delete All</button>
          <button onClick={onDeleteSelected}>Delete Selected</button>
          <button onClick={reJSON}>json</button>
          <button onClick={() => {
            editor.cleanSelection();
          }}>clean</button>
          <button onClick={testActive}>active</button>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={onAddText}>Add Text</button>
          <input
            type='text'
            value={strokeColor || editor.strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
          />
          <button onClick={onSetStrokeColor}>Set Stroke Color</button>
          <input
            type='text'
            value={fillColor || editor.fillColor}
            onChange={(e) => setFillColor(e.target.value)}
          />
          <button onClick={onSetFillColor}>Set Fill Color</button>

          <pre>
            fillColor: {editor.fillColor}, strokeColor: {editor.strokeColor}
          </pre>
          <pre>{JSON.stringify(selectedObjects)}</pre>
        </div>
      ) : (
        <>Loading...</>
      )}
      <div onClick={(e) => clicked(e)}>
        <FabricJSCanvas disable={selectedObjects ? selectedObjects?.length > 0 : false} className='sample-canvas' onReady={onReady} />
      </div>
    </>
  )
}

export default App
