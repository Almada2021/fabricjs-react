# fabricjs-react-improve upgrade of fabricjs-react by Tobias Almada
<img src="./img/fri.png"/>

## Message for you
I created this project based on another library because I needed it for a job but the original library did not allow me to do several things that I needed as a developer.
I hope you can find it useful like me 
## Objective
The main objective of this library is to provide a simple tool for solving common canvas problems.
Allowing a simple use within react by transferring the difficulty of the native api canvas and other libraries like fabricjs to a few lines of code.
to this end, we seek to implement
+ Reusable components
+ A canvas that can communicate with other components
+ a lot of parameters that allow to perform many complex functions in a straightforward way
+ very good performance the library seeks an experience similar to that of native apps
## Metadata
for the purpouse of created an integrated experience for developers in this library you can add metadata inside all objects.\
How ?
```
editor?.addCircle(
    { left: 80, top: 160, width: 80, height: 80, radius: 80, angle: 0 },
    { type: "CIRCLE", id:1 });

```
In this example you can pass two objects to the method addCircle the first objects is an optional parameter that allows you control the position, height, width, etc.\
and the second parameter is you object for metadata you can created an id and optional type and more
this objects is inside the object inside the <b>optional</b> keyword
but this is only and example you don't need add type and id properties you can add whatever you want the id is very usefull with the <a href="#ControlProvider">ControlProvider</a> and uuid for do operations outside the canvas Component 

## Components
this software library adds the following components to enhance the developer experience
<a id="ControlProvider"></a>
### ControlProvider
one of the main problems when creating things with the canvas and other api like the localStorage, the audio api or the video api is that the code ends up being a 500 line file, what solution does FRI(Fabricjs-React-Improve) offer?
a provider pattern like in redux the provider has the following requirements for use: \
+ has to be in the same component as useFabricJSEditor
+ must receive two unstructured properties from the other hook the editor and selectedObjects
```
    import { useEffect, useState } from 'react'
    import { ControlProvider, FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react-improve'
    import Test from "./Test";
    function App() {
      const { selectedObjects, editor, onReady} = useFabricJSEditor({ defaultStrokeColor: 'red'})
      return (
        <ControlProvider editor={editor} selectedObjects={selectedObjects}>
            <div>
                <Test/>
                <FabricJSCanvas 
                    disable={selectedObjects ? selectedObjects?.length > 0 : false} className='sample-canvas' 
                    onReady={onReady} 
                />
            </div>
        </ControlProvider>
      )
    }
```
the provider control does not need to have the canvas inside it, it just needs to be in the same file as the hook mentioned above, then it will allow us to use it in the following way
```
import { useControl } from "fabricjs-react-improve"

const Test = () => {
    const { editor, selectedObjects } = useControl();
    const add = () => {
        editor?.addRectangle()
    }
    return (
        <div>
            Test
            <button onClick={add}>clicMe</button>

        </div>
    )
}

export default Test
```

with the useControl hook we can access the editor and the objects selected by the user
in this example this button of the Test component can now use the editor without being in the same component as the canvas and avoiding prop drilling
## ShadowCanvas 
this is a concept used in this library a ShadowCanvas is only a div used to capture the position of mouse and touch events simplified the proccess of develop in touch screen and our shadowCanvas by Default works in this way
## Thanks to Alejandro Soto
This library was not started as a project from scratch because is a fork of another library called fabricjs-react developed by Alejandro Soto. \
we can't leave aside his important creation since the base of the library was made by him you can make a donation to that person through the following URL:
<a href="https://www.buymeacoffee.com/alecode">Donation for Alejandro Soto</a>