import type React from "react"
export interface Position {
  x: number
  y: number
}

export interface FlowNodeData {
  label: string
  [key: string]: any
}

export interface FlowNode {
  id: string
  type: string
  position: Position
  data: FlowNodeData
}

export interface FlowConnection {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  label?: string
  type?: string
}

export interface FlowValidationError {
  type: string
  message: string
  title?: string
  nodeIds?: string[]
}

export interface BlockDefinition {
  id: string
  type: string
  name: string
  description: string
  icon: React.ElementType
  fixed?: boolean
  properties?: {
    name: string
    label: string
    type: string
    defaultValue?: any
    options?: { label: string; value: string }[]
  }[]
}

export interface ConnectionStyle {
  stroke?: string
  strokeWidth?: number
  animated?: boolean
}
