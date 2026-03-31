/**
 * Shared premium design hooks for public portal pages.
 * - useScrollReveal: IntersectionObserver-based reveal animation
 * - useAnimatedCounter: Count-up animation for numbers
 * - useCardTilt: 3D perspective tilt following cursor
 */
import { useEffect, useRef, useState, useCallback } from 'react'

/* ── Scroll-Reveal ── */
export function useScrollReveal(threshold = 0.12) {
    const observerRef = useRef(null)
    const elRef = useRef(null)

    // Callback ref: fires every time the DOM node is attached/detached
    const setRef = useCallback((node) => {
        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect()
            observerRef.current = null
        }
        elRef.current = node
        if (!node) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    node.classList.add('revealed')
                    observer.unobserve(node)
                }
            },
            { threshold }
        )
        observer.observe(node)
        observerRef.current = observer
    }, [threshold])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [])

    return setRef
}

/* ── Animated Counter ── */
export function useAnimatedCounter(target, duration = 1600) {
    const [value, setValue] = useState(0)
    const [started, setStarted] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true)
                    observer.unobserve(el)
                }
            },
            { threshold: 0.3 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [started])

    useEffect(() => {
        if (!started) return
        const start = performance.now()
        const animate = (now) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // easeOutExpo for a satisfying deceleration
            const eased = 1 - Math.pow(2, -10 * progress)
            setValue(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [started, target, duration])

    return { ref, value }
}

/* ── 3D Card Tilt ── */
export function useCardTilt(maxDeg = 6) {
    const handleMove = useCallback((e) => {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `perspective(600px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) scale3d(1.02, 1.02, 1.02)`
    }, [maxDeg])

    const handleLeave = useCallback((e) => {
        e.currentTarget.style.transform = ''
    }, [])

    return { onMouseMove: handleMove, onMouseLeave: handleLeave }
}
