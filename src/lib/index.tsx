import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { useFabricJSEditor, FabricJSEditor, FabricJSEditorHook } from './editor'
import ControlProvider from './ControlProvider';
import { useControl, ControlContextType } from './ControlProvider';
export interface Props {
  className?: string
  disable?: boolean
  onReady?: (canvas: fabric.Canvas) => void
}

/**
 * Fabric canvas as component
 */
const FabricJSCanvas = ({ className, onReady, disable }: Props) => {
  const canvasEl = useRef(null)
  const canvasElParent = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current)
    const setCurrentDimensions = () => {
      canvas.setHeight(canvasElParent.current?.clientHeight || 0)
      canvas.setWidth(canvasElParent.current?.clientWidth || 0)
      canvas.renderAll()
    }
    const resizeCanvas = () => {
      setCurrentDimensions()
    }
    setCurrentDimensions()

    window.addEventListener('resize', resizeCanvas, false)

    if (onReady) {
      onReady(canvas)
    }

    return () => {
      canvas.dispose()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  const creation = (e:any) => {
    if(disable){
      e.stopPropagation();
    }
  }
  return (
    <div onClick={(e: any) => creation(e)} ref={canvasElParent} className={className}>
      <canvas ref={canvasEl} />
    </div>
  )
}

export { FabricJSCanvas, useFabricJSEditor, ControlProvider, useControl }
export type { FabricJSEditor, FabricJSEditorHook, ControlContextType }
