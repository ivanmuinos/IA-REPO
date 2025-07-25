"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { PersonaDetailTemplate } from "@/components/personas/PersonaDetailTemplate"
import { toast } from "sonner"

// Datos de ejemplo (reemplazar con llamadas reales a la API)
const mockPersona = {
  id: "1",
  nombre: "Carlos Rodríguez García",
  documento: "12345678A",
  email: "carlos.rodriguez@email.com",
  telefono: "+34 612 345 678",
  fecha: "15/01/2024",
  progreso: 100,
  estado: "completado",
  flujo: "KYC Básico",
  datosOCR: {
    nombre: "Carlos",
    apellidos: "Rodríguez García",
    documento: "12345678A",
    tipoDocumento: "DNI",
    fechaNacimiento: "15/03/1985",
    nacionalidad: "Española"
  },
  perfilRiesgo: {
    nivelRiesgo: "Bajo",
    compliance: "Aprobado"
  },
  cronologia: [
    {
      title: "Inicio del proceso",
      description: "Usuario inició el proceso de verificación",
      timestamp: "14:30:00"
    },
    {
      title: "Documento subido",
      description: "DNI cargado exitosamente",
      timestamp: "14:31:00"
    },
    {
      title: "OCR completado",
      description: "Procesamiento OCR exitoso",
      timestamp: "14:32:00"
    }
  ]
}

export default function PersonaDetailPageUnified() {
  const params = useParams()
  const [persona, setPersona] = useState(mockPersona)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    const loadPersona = async () => {
      setLoading(true)
      try {
        // Aquí iría la llamada real a la API
        // const data = await fetchPersona(params.id as string)
        // setPersona(data)
        
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setPersona(mockPersona)
      } catch (error) {
        toast.error("Error al cargar los datos de la persona")
      } finally {
        setLoading(false)
      }
    }

    loadPersona()
  }, [params.id])

  const handleApprove = async () => {
    try {
      // Aquí iría la lógica real de aprobación
      toast.success("Verificación aprobada exitosamente")
    } catch (error) {
      toast.error("Error al aprobar la verificación")
    }
  }

  const handleReject = async () => {
    try {
      // Aquí iría la lógica real de rechazo
      toast.success("Verificación rechazada")
    } catch (error) {
      toast.error("Error al rechazar la verificación")
    }
  }

  const handleExport = async () => {
    try {
      // Aquí iría la lógica real de exportación
      const dataStr = JSON.stringify(persona, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `persona-${persona.id}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success("Datos exportados exitosamente")
    } catch (error) {
      toast.error("Error al exportar los datos")
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando datos de la persona...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PersonaDetailTemplate
      persona={persona}
      onApprove={handleApprove}
      onReject={handleReject}
      onExport={handleExport}
    />
  )
} 