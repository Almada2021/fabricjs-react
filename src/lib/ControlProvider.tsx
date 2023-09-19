import { createContext, useContext } from "react";
import { FabricJSEditor } from "./editor";
interface IControlProvider {
    children: any;
    selectedObjects: fabric.Object[] | undefined;
    editor: FabricJSEditor | undefined;
}
export interface ControlContextType {
    selectedObjects: fabric.Object[] | undefined;
    editor: FabricJSEditor | undefined;
}
const CanvasContext = createContext<ControlContextType | undefined>(undefined);
const ControlProvider = ({ children, selectedObjects, editor }: IControlProvider) => {
    return (
        <CanvasContext.Provider value={{ selectedObjects, editor }}>
            {children}
        </CanvasContext.Provider>)
}

export default ControlProvider
export function useControl(): ControlContextType {
    const context = useContext(CanvasContext);

    if (context === undefined) {
        throw new Error("useControl debe utilizarse dentro de un ControlProvider");
    }

    return context;
}