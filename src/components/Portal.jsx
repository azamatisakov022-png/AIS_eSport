import { createPortal } from 'react-dom'

/**
 * Portal - renders children into document.body.
 * Use this to wrap drawer/modal overlays so they are positioned
 * relative to the viewport, not the scrollable layout container.
 *
 * Usage: <Portal><div className="my-modal-overlay">...</div></Portal>
 */
export default function Portal({ children }) {
    return createPortal(children, document.body)
}
