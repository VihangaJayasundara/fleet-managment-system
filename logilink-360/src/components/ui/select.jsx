import * as React from "react"
import { createPortal } from "react-dom"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [triggerRect, setTriggerRect] = React.useState(null)
  const selectRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        if (event.target instanceof Element && !event.target.closest('.select-portal-content')) {
          setIsOpen(false)
        }
      }
    }

    const handleScroll = (e) => {
      if (isOpen && e.target instanceof Element && !e.target.closest('.select-portal-content')) {
        setIsOpen(false)
      }
    }

    const handleResize = () => setIsOpen(false)

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("scroll", handleScroll, true)
    window.addEventListener("resize", handleResize)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll, true)
      window.removeEventListener("resize", handleResize)
    }
  }, [isOpen])

  let selectedLabel = null;
  React.Children.forEach(children, child => {
    if (child && child.type === SelectContent) {
      React.Children.forEach(child.props.children, item => {
        if (item && item.type === SelectItem && item.props.value === value) {
          selectedLabel = item.props.children;
        }
      })
    }
  })

  const handleToggle = () => {
    if (!isOpen && selectRef.current) {
      setTriggerRect(selectRef.current.getBoundingClientRect())
    }
    setIsOpen(!isOpen)
  }

  return (
    <div ref={selectRef} className="relative" {...props}>
      {React.Children.map(children, child => {
        if (!child) return null;
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: handleToggle,
            isOpen,
            value,
            selectedLabel
          })
        }
        if (child.type === SelectContent) {
          return isOpen ? React.cloneElement(child, {
            onSelect: (val) => {
              onValueChange?.(val)
              setIsOpen(false)
            },
            value,
            triggerRect
          }) : null
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, onClick, isOpen, value, selectedLabel, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-100",
      className
    )}
    {...props}
  >
    {React.Children.map(children, child => {
      if (child && child.type === SelectValue) {
        return React.cloneElement(child, { value, selectedLabel })
      }
      return child
    })}
    <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, children, value, selectedLabel }) => (
  <span className="text-zinc-300 truncate">
    {children || selectedLabel || (value ? value : placeholder)}
  </span>
)

const SelectContent = ({ children, onSelect, value, className, triggerRect }) => {
  if (!triggerRect) return null;

  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const isFlipped = spaceBelow < 250 && spaceAbove > spaceBelow;

  const style = {
    position: 'fixed',
    left: triggerRect.left,
    width: triggerRect.width,
    zIndex: 99999,
  };

  if (isFlipped) {
    style.bottom = window.innerHeight - triggerRect.top + 4;
    style.maxHeight = `${Math.max(100, Math.min(spaceAbove - 16, 300))}px`;
  } else {
    style.top = triggerRect.bottom + 4;
    style.maxHeight = `${Math.max(100, Math.min(spaceBelow - 16, 300))}px`;
  }

  return createPortal(
    <div
      className={cn("select-portal-content overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl", className)}
      style={style}
    >
      <div className="p-1">
        {React.Children.map(children, child =>
          child ? React.cloneElement(child, { onSelect, selected: child.props.value === value }) : null
        )}
      </div>
    </div>,
    document.body
  )
}

const SelectItem = React.forwardRef(({ className, children, value, onSelect, selected, ...props }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.stopPropagation()
      onSelect?.(value)
    }}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-zinc-800 focus:bg-zinc-800",
      selected && "bg-zinc-800",
      className
    )}
    {...props}
  >
    <span className="text-zinc-100">{children}</span>
  </div>
))
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
