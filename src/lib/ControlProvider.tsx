import { createContext, useContext } from "react";
interface IControlProvider {
    children: any
    selectedObjects: fabric.Object[]
    editor: any
}
const CanvasContext: any = createContext(null);
const ControlProvider = ({ children, selectedObjects, editor }: IControlProvider) => {
    return (
        <CanvasContext.Provider value={{ selectedObjects, editor }}>
            {children}
        </CanvasContext.Provider>)
}

export default ControlProvider
export function useControl() {
    return useContext(CanvasContext)
}