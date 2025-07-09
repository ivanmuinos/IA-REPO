/**
 * Utility to suppress ResizeObserver loop errors
 * These errors are generally harmless but can pollute the console
 */
export function suppressResizeObserverLoopError() {
  // Store the original error handler
  const originalOnError = window.onerror

  // Override the error handler to catch and suppress ResizeObserver errors
  window.onerror = function (message, source, lineno, colno, error) {
    // Check if the error is a ResizeObserver loop error
    if (
      message.toString().includes("ResizeObserver loop") ||
      (error && error.message && error.message.includes("ResizeObserver loop"))
    ) {
      // Suppress the error
      console.warn("ResizeObserver loop error suppressed")
      return true // Prevents the error from being displayed in the console
    }

    // Call the original error handler for other errors
    if (originalOnError) {
      return originalOnError.apply(this, arguments as any)
    }

    return false
  }
}

/**
 * Debounces a function to prevent too many calls in a short period
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
