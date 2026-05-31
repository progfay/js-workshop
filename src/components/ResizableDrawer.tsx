import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** 初期の高さ (px) */
  defaultHeight?: number
  /** ドロワーの最小高さ (px) */
  minHeight?: number
  /** 上のエディタ等に残す最小スペース (px) */
  minTopSpace?: number
}

/**
 * 上端のハンドルをマウス(ポインタ)でドラッグして高さを伸縮できるドロワー。
 * 高さは親要素の高さから minTopSpace を引いた値を上限にクランプする。
 */
export function ResizableDrawer({
  children,
  defaultHeight = 260,
  minHeight = 120,
  minTopSpace = 140,
}: Props) {
  const [height, setHeight] = useState(defaultHeight)
  const drawerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const drawer = drawerRef.current
      if (!dragging.current || !drawer) return
      const bottom = drawer.getBoundingClientRect().bottom
      const parent = drawer.parentElement
      const maxHeight = parent
        ? parent.getBoundingClientRect().height - minTopSpace
        : Number.POSITIVE_INFINITY
      const next = Math.min(Math.max(bottom - event.clientY, minHeight), Math.max(minHeight, maxHeight))
      setHeight(next)
    }
    const stop = () => {
      if (!dragging.current) return
      dragging.current = false
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', stop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', stop)
    }
  }, [minHeight, minTopSpace])

  const startDrag = (event: React.PointerEvent) => {
    event.preventDefault()
    dragging.current = true
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'row-resize'
  }

  return (
    <div className="drawer" ref={drawerRef} style={{ height }}>
      <div
        className="drawer-handle"
        role="separator"
        aria-orientation="horizontal"
        aria-label="ドロワーの高さを変更"
        onPointerDown={startDrag}
      />
      {children}
    </div>
  )
}
