import { useState, useCallback } from 'react'

interface LoadingState {
  isLoading: boolean
  error: string | null
  data: any | null
}

interface UseLoadingStateOptions {
  initialData?: any
  onError?: (error: string) => void
  onSuccess?: (data: any) => void
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    data: options.initialData || null,
  })

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: isLoading ? null : prev.error }))
  }, [])

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false }))
    options.onError?.(error)
  }, [options.onError])

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data, isLoading: false, error: null }))
    options.onSuccess?.(data)
  }, [options.onSuccess])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: options.initialData || null,
    })
  }, [options.initialData])

  const executeAsync = useCallback(async (asyncFunction: () => Promise<any>) => {
    setLoading(true)
    try {
      const result = await asyncFunction()
      setData(result)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      throw error
    }
  }, [setLoading, setData, setError])

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset,
    executeAsync,
  }
}

// Hook específico para operaciones CRUD
export function useCrudState<T = any>(options: UseLoadingStateOptions = {}) {
  const [items, setItems] = useState<T[]>([])
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  
  const loadingState = useLoadingState(options)

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item])
  }, [])

  const updateItem = useCallback((id: string | number, updates: Partial<T>) => {
    setItems(prev => prev.map(item => 
      (item as any).id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const removeItem = useCallback((id: string | number) => {
    setItems(prev => prev.filter(item => (item as any).id !== id))
  }, [])

  const selectItem = useCallback((item: T | null) => {
    setSelectedItem(item)
  }, [])

  return {
    ...loadingState,
    items,
    selectedItem,
    addItem,
    updateItem,
    removeItem,
    selectItem,
    setItems,
  }
} 