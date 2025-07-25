"use client"

import * as React from "react"
import { Upload, X, File, FileText, Image, Video, Music } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void
  multiple?: boolean
  accept?: string
  maxSize?: number // en bytes
  maxFiles?: number
  disabled?: boolean
  className?: string
  placeholder?: string
}

interface FileWithPreview extends File {
  preview?: string
  id: string
}

export function FileUpload({
  onFileSelect,
  multiple = false,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB por defecto
  maxFiles = 5,
  disabled = false,
  className,
  placeholder = "Arrastra archivos aquí o haz clic para seleccionar",
}: FileUploadProps) {
  const [files, setFiles] = React.useState<FileWithPreview[]>([])
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="h-4 w-4" />
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />
    if (file.type.startsWith("audio/")) return <Music className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: FileWithPreview[] = []
    const fileArray = Array.from(selectedFiles)

    for (const file of fileArray) {
      // Validar tamaño
      if (file.size > maxSize) {
        alert(`El archivo ${file.name} es demasiado grande. Máximo ${formatFileSize(maxSize)}`)
        continue
      }

      // Validar tipo
      if (accept && !accept.split(",").some(type => {
        const trimmedType = type.trim()
        if (trimmedType.startsWith(".")) {
          return file.name.toLowerCase().endsWith(trimmedType)
        }
        return file.type.match(new RegExp(trimmedType.replace("*", ".*")))
      })) {
        alert(`El archivo ${file.name} no es del tipo permitido`)
        continue
      }

      const fileWithPreview: FileWithPreview = {
        ...file,
        id: Math.random().toString(36).substr(2, 9),
      }

      // Crear preview para imágenes
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          fileWithPreview.preview = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }

      newFiles.push(fileWithPreview)
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
    const finalFiles = updatedFiles.slice(0, maxFiles)
    
    setFiles(finalFiles)
    onFileSelect?.(finalFiles)
  }

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id)
    setFiles(updatedFiles)
    onFileSelect?.(updatedFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">{placeholder}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Máximo {formatFileSize(maxSize)} por archivo
          {multiple && `, hasta ${maxFiles} archivos`}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Archivos seleccionados:</Label>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 