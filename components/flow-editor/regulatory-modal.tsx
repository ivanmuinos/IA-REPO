"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Shield, FileText, UserCheck, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { FlowNode, FlowConnection } from "@/types/flow"

interface RegulatoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddNodes: (nodes: FlowNode[], connections: FlowConnection[]) => void
}

export function RegulatoryModal({ open, onOpenChange, onAddNodes }: RegulatoryModalProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>()
  const { toast } = useToast()

  const regulatoryFrameworks = {
    argentina: {
      name: "Argentina",
      description:
        "Marco regulatorio para Argentina que incluye normativas de UIF, BCRA y AFIP para procesos de KYC/KYB.",
      regulations: ["UIF (Unidad de Información Financiera)", "BCRA (Banco Central)", "AFIP (Administración Federal)"],
      nodes: [
        {
          id: "uif-pep",
          type: "listas",
          position: { x: 300, y: 300 },
          data: {
            label: "Verificación UIF/PEP",
            description: "Verificación contra listas UIF/PEP locales",
            isRegulatory: true,
            country: "argentina",
            regulation: "UIF",
            pep: true,
            sanciones: true,
            terrorismo: true,
            proveedorListas: "interno",
            comportamientoListas: "manual",
          },
        },
        {
          id: "afip-cuit",
          type: "ocr",
          position: { x: 300, y: 450 },
          data: {
            label: "Validación CUIT/AFIP",
            description: "Validación de CUIT ante AFIP",
            isRegulatory: true,
            country: "argentina",
            regulation: "AFIP",
            dni: true,
            caducidad: true,
            autenticidad: true,
            umbral: 85,
          },
        },
        {
          id: "revision-uif",
          type: "revision",
          position: { x: 300, y: 600 },
          data: {
            label: "Revisión manual UIF",
            description: "Revisión manual si se detecta alerta en base UIF",
            isRegulatory: true,
            country: "argentina",
            regulation: "UIF",
            tiempoEspera: "45",
            notificarEmail: true,
            comportamientoTimeout: "continue",
          },
        },
        {
          id: "reporte-ros",
          type: "decision",
          position: { x: 300, y: 750 },
          data: {
            label: "Reporte de actividad sospechosa",
            description: "Reporte ROS para UIF",
            isRegulatory: true,
            country: "argentina",
            regulation: "UIF",
            condicionAprobacion: "custom",
            reglasPersonalizadas: "uif.score > 70 AND !pep.match",
            accionAprobacion: "continue",
            accionRechazo: "manual",
          },
        },
      ],
      connections: [
        { id: "uif-pep-to-afip", source: "uif-pep", target: "afip-cuit" },
        { id: "afip-to-revision", source: "afip-cuit", target: "revision-uif" },
        { id: "revision-to-reporte", source: "revision-uif", target: "reporte-ros" },
      ],
    },
    brasil: {
      name: "Brasil",
      description:
        "Marco regulatorio para Brasil que incluye normativas de BACEN, LGPD, Receita Federal y PLD para procesos de KYC/KYB.",
      regulations: [
        "BACEN (Banco Central)",
        "LGPD (Ley General de Protección de Datos)",
        "Receita Federal",
        "PLD (Prevención de Lavado de Dinero)",
      ],
      nodes: [
        {
          id: "receita-cpf",
          type: "ocr",
          position: { x: 300, y: 300 },
          data: {
            label: "Consulta CPF/CNPJ",
            description: "Consulta de CPF/CNPJ contra Receita Federal",
            isRegulatory: true,
            country: "brasil",
            regulation: "Receita Federal",
            dni: true,
            caducidad: true,
            autenticidad: true,
            umbral: 90,
          },
        },
        {
          id: "pep-ofac",
          type: "listas",
          position: { x: 300, y: 450 },
          data: {
            label: "Verificación PEP/OFAC",
            description: "Verificación contra listas PEP locales y OFAC",
            isRegulatory: true,
            country: "brasil",
            regulation: "PLD",
            pep: true,
            sanciones: true,
            terrorismo: true,
            fraude: true,
            proveedorListas: "worldcheck",
            comportamientoListas: "manual",
          },
        },
        {
          id: "lgpd-consent",
          type: "mensaje",
          position: { x: 300, y: 600 },
          data: {
            label: "Consentimiento LGPD",
            description: "Validación de consentimiento LGPD (firma electrónica)",
            isRegulatory: true,
            country: "brasil",
            regulation: "LGPD",
            tituloMensaje: "Consentimiento LGPD",
            cuerpoMensaje:
              "De acuerdo con la Ley General de Protección de Datos (LGPD), necesitamos su consentimiento para procesar sus datos personales.",
            tipoMensaje: "info",
            textoBoton: "Acepto los términos",
            requiereConfirmacion: true,
          },
        },
        {
          id: "decision-riesgo",
          type: "decision",
          position: { x: 300, y: 750 },
          data: {
            label: "Decisión por score de riesgo",
            description: "Decisión automática según score de riesgo",
            isRegulatory: true,
            country: "brasil",
            regulation: "BACEN",
            condicionAprobacion: "custom",
            reglasPersonalizadas: "pld.score > 75 AND lgpd.consent == true",
            accionAprobacion: "continue",
            accionRechazo: "manual",
          },
        },
      ],
      connections: [
        { id: "receita-to-pep", source: "receita-cpf", target: "pep-ofac" },
        { id: "pep-to-lgpd", source: "pep-ofac", target: "lgpd-consent" },
        { id: "lgpd-to-decision", source: "lgpd-consent", target: "decision-riesgo" },
      ],
    },
  }

  const handleAddNodes = () => {
    if (!selectedCountry) return

    const country = selectedCountry as keyof typeof regulatoryFrameworks
    const framework = regulatoryFrameworks[country]

    if (framework) {
      // Generar IDs únicos para evitar colisiones
      const timestamp = Date.now().toString()
      const nodes = framework.nodes.map((node) => ({
        ...node,
        id: `${node.id}-${timestamp}`,
      }))

      // Actualizar las conexiones con los nuevos IDs
      const connections = framework.connections.map((conn) => ({
        id: `${conn.id}-${timestamp}`,
        source: `${conn.source}-${timestamp}`,
        target: `${conn.target}-${timestamp}`,
      }))

      onAddNodes(nodes, connections)

      toast({
        title: "Nodos regulatorios añadidos",
        description: `Se han añadido ${nodes.length} nodos regulatorios para ${framework.name}`,
      })

      onOpenChange(false)
    }
  }

  const renderNodeIcon = (type: string) => {
    switch (type) {
      case "listas":
        return <Shield className="h-4 w-4 text-primary" />
      case "ocr":
        return <FileText className="h-4 w-4 text-primary" />
      case "revision":
        return <AlertCircle className="h-4 w-4 text-primary" />
      case "decision":
        return <FileCheck className="h-4 w-4 text-primary" />
      case "mensaje":
        return <UserCheck className="h-4 w-4 text-primary" />
      default:
        return <Shield className="h-4 w-4 text-primary" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Agregar flujos regulatorios por país
          </DialogTitle>
          <DialogDescription>
            Seleccioná un país para añadir automáticamente los nodos regulatorios necesarios para cumplir con la
            normativa correspondiente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="country-select" className="text-sm font-medium">
              País
            </label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger id="country-select">
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="argentina">Argentina</SelectItem>
                <SelectItem value="brasil">Brasil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedCountry && (
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="nodes">Nodos a insertar</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {regulatoryFrameworks[selectedCountry as keyof typeof regulatoryFrameworks].name}
                    </CardTitle>
                    <CardDescription>
                      {regulatoryFrameworks[selectedCountry as keyof typeof regulatoryFrameworks].description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Normativas incluidas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {regulatoryFrameworks[selectedCountry as keyof typeof regulatoryFrameworks].regulations.map(
                          (reg, index) => (
                            <Badge key={index} variant="outline">
                              {reg}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="nodes" className="mt-4">
                <div className="space-y-3">
                  {regulatoryFrameworks[selectedCountry as keyof typeof regulatoryFrameworks].nodes.map(
                    (node, index) => (
                      <Card key={index}>
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {renderNodeIcon(node.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{node.data.label}</p>
                              <Badge variant="secondary" className="ml-2">
                                Regulatorio
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{node.data.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">{node.data.regulation}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddNodes} disabled={!selectedCountry}>
            Agregar al flujo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
