"use client"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export function Notificaciones() {
  const { toast } = useToast()
  const [alertasEmail, setAlertasEmail] = useState(true)
  const [correoContacto, setCorreoContacto] = useState("soporte@empresa.com")
  const [eventosNotificacion, setEventosNotificacion] = useState([
    { id: "validacion-rechazada", label: "Validación rechazada", checked: true },
    { id: "flujo-sin-finalizar", label: "Flujo sin finalizar", checked: false },
    { id: "conector-error", label: "Conector con error", checked: true },
  ])

  const handleEventoChange = (id: string, checked: boolean) => {
    setEventosNotificacion(eventosNotificacion.map((evento) => (evento.id === id ? { ...evento, checked } : evento)))
  }

  const handleGuardarNotificaciones = () => {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (alertasEmail && !emailRegex.test(correoContacto)) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un correo electrónico válido",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Notificaciones guardadas",
      description: "La configuración de notificaciones ha sido guardada correctamente",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificaciones</CardTitle>
        <CardDescription>Configura las alertas y notificaciones del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="alertas-email">Activar alertas por email ante flujos fallidos</Label>
            <p className="text-sm text-muted-foreground">
              Recibe notificaciones por correo cuando ocurran errores en los flujos
            </p>
          </div>
          <Switch id="alertas-email" checked={alertasEmail} onCheckedChange={setAlertasEmail} />
        </div>

        {alertasEmail && (
          <div className="grid gap-2">
            <Label htmlFor="correo-contacto">Correo de contacto técnico</Label>
            <Input
              id="correo-contacto"
              type="email"
              placeholder="soporte@empresa.com"
              value={correoContacto}
              onChange={(e) => setCorreoContacto(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-4">
          <Label>Elegir eventos que disparan notificación</Label>
          <div className="space-y-2">
            {eventosNotificacion.map((evento) => (
              <div key={evento.id} className="flex items-center space-x-2">
                <Checkbox
                  id={evento.id}
                  checked={evento.checked}
                  onCheckedChange={(checked) => handleEventoChange(evento.id, checked === true)}
                  disabled={!alertasEmail}
                />
                <Label htmlFor={evento.id} className={!alertasEmail ? "text-muted-foreground" : ""}>
                  {evento.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGuardarNotificaciones} disabled={!alertasEmail}>
          <Save className="mr-2 h-4 w-4" />
          Guardar notificaciones
        </Button>
      </CardFooter>
    </Card>
  )
}
