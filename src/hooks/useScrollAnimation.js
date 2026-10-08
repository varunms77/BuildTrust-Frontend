import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for scroll-triggered animations using IntersectionObserver.
 * @param {number} threshold - Visibility threshold (0 to 1)
 * @returns {[React.RefObject, boolean]} - ref to attach, visibility state
 */
export function useScrollAnimation(threshold = 0.2) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    )

    const el = ref.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [threshold])

  return [ref, isVisible]
}
