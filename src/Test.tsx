import { useControl } from "./lib"

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