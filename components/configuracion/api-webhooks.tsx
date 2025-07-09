"use client"

import { useState } from "react"
import { Copy, Key, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo para API Keys
const apiKeysIniciales = [
  { id: 1, nombre: "API Producción", fechaCreacion: "15/03/2023", estado: "Activo", ultimoUso: "Hace 2 horas" },
  { id: 2, nombre: "API Testing", fechaCreacion: "20/04/2023", estado: "Activo", ultimoUso: "Hace 1 día" },
  { id: 3, nombre: "API Desarrollo", fechaCreacion: "05/05/2023", estado: "Revocado", ultimoUso: "Hace 15 días" },
]

// Datos de ejemplo para Webhooks
const webhooksIniciales = [
  { id: 1, url: "https://api.empresa.com/webhooks/flujos", evento: "Nuevo flujo" },
  { id: 2, url: "https://api.empresa.com/webhooks/validaciones", evento: "Validación fallida" },
]

export function ApiWebhooks() {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState(apiKeysIniciales)
  const [webhooks, setWebhooks] = useState(webhooksIniciales)
  const [nuevaApiKey, setNuevaApiKey] = useState("")
  const [dialogApiKeyOpen, setDialogApiKeyOpen] = useState(false)
  const [nuevoWebhookUrl, setNuevoWebhookUrl] = useState("")
  const [nuevoWebhookEvento, setNuevoWebhookEvento] = useState("Nuevo flujo")
  const [mostrarNuevaApiKey, setMostrarNuevaApiKey] = useState(false)
  const [apiKeyGenerada, setApiKeyGenerada] = useState("")

  const generarApiKey = () => {
    // Simulación de generación de API Key
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let resultado = ""
    for (let i = 0; i < 32; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    return resultado
  }

  const handleCrearApiKey = () => {
    if (!nuevaApiKey) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un nombre para la API Key",
        variant: "destructive",
      })
      return
    }

    const apiKeyValue = generarApiKey()
    setApiKeyGenerada(apiKeyValue)
    setMostrarNuevaApiKey(true)

    const nuevaKey = {
      id: apiKeys.length + 1,
      nombre: nuevaApiKey,
      fechaCreacion: new Date().toLocaleDateString(),
      estado: "Activo",
      ultimoUso: "Nunca",
    }

    setApiKeys([...apiKeys, nuevaKey])
    setNuevaApiKey("")
  }

  const handleCopiarApiKey = () => {
    navigator.clipboard.writeText(apiKeyGenerada)
    toast({
      title: "API Key copiada",
      description: "La API Key ha sido copiada al portapapeles",
    })
  }

  const handleCerrarDialogApiKey = () => {
    setDialogApiKeyOpen(false)
    setMostrarNuevaApiKey(false)
    setApiKeyGenerada("")
  }

  const handleGuardarWebhook = () => {
    if (!nuevoWebhookUrl || !nuevoWebhookUrl.startsWith("http")) {
      toast({
        title: "Error",
        description: "Por favor, ingresa una URL válida para el webhook",
        variant: "destructive",
      })
      return
    }

    const nuevoWebhook = {
      id: webhooks.length + 1,
      url: nuevoWebhookUrl,
      evento: nuevoWebhookEvento,
    }

    setWebhooks([...webhooks, nuevoWebhook])
    setNuevoWebhookUrl("")
    setNuevoWebhookEvento("Nuevo flujo")

    toast({
      title: "Webhook guardado",
      description: "El webhook ha sido configurado correctamente",
    })
  }

  const cambiarEstadoApiKey = (id: number) => {
    setApiKeys(
      apiKeys.map((apiKey) => {
        if (apiKey.id === id) {
          const nuevoEstado = apiKey.estado === "Activo" ? "Revocado" : "Activo"
          return { ...apiKey, estado: nuevoEstado }
        }
        return apiKey
      }),
    )

    const apiKey = apiKeys.find((k) => k.id === id)
    if (apiKey) {
      toast({
        title: `API Key ${apiKey.estado === "Activo" ? "revocada" : "activada"}`,
        description: `${apiKey.nombre} ha sido ${apiKey.estado === "Activo" ? "revocada" : "activada"} correctamente`,
      })
    }
  }

  const eliminarApiKey = (id: number) => {
    const apiKey = apiKeys.find((k) => k.id === id)
    setApiKeys(apiKeys.filter((apiKey) => apiKey.id !== id))

    if (apiKey) {
      toast({
        title: "API Key eliminada",
        description: `${apiKey.nombre} ha sido eliminada correctamente`,
      })
    }
  }

  const eliminarWebhook = (id: number) => {
    const webhook = webhooks.find((w) => w.id === id)
    setWebhooks(webhooks.filter((webhook) => webhook.id !== id))

    if (webhook) {
      toast({
        title: "Webhook eliminado",
        description: `El webhook para ${webhook.evento} ha sido eliminado correctamente`,
      })
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Administra las claves de API para integrar con otros sistemas</CardDescription>
          </div>
          <Dialog open={dialogApiKeyOpen} onOpenChange={setDialogApiKeyOpen}>
            <DialogTrigger asChild>
              <Button>
                <Key className="mr-2 h-4 w-4" />
                Crear nueva API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva API Key</DialogTitle>
                <DialogDescription>Crea una nueva clave de API para integrar con otros sistemas.</DialogDescription>
              </DialogHeader>
              {!mostrarNuevaApiKey ? (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre-api">Nombre de la API Key</Label>
                    <Input
                      id="nombre-api"
                      placeholder="Ej: API Producción"
                      value={nuevaApiKey}
                      onChange={(e) => setNuevaApiKey(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogApiKeyOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCrearApiKey}>Generar API Key</Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="api-key">Tu nueva API Key</Label>
                    <div className="flex items-center gap-2">
                      <Input id="api-key" value={apiKeyGenerada} readOnly className="font-mono text-xs" />
                      <Button size="sm" variant="outline" onClick={handleCopiarApiKey}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Guarda esta clave en un lugar seguro. No podrás verla nuevamente.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCerrarDialogApiKey}>Cerrar</Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Fecha de creación</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Último uso</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="border-b">
                    <td className="px-4 py-3 text-sm">{apiKey.nombre}</td>
                    <td className="px-4 py-3 text-sm">{apiKey.fechaCreacion}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={apiKey.estado === "Activo" ? "success" : "destructive"}>{apiKey.estado}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{apiKey.ultimoUso}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => cambiarEstadoApiKey(apiKey.id)}>
                            {apiKey.estado === "Activo" ? "Revocar" : "Activar"} API Key
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => eliminarApiKey(apiKey.id)}>
                            Eliminar API Key
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Configura URLs para recibir notificaciones de eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="flex items-center justify-between rounded-md border p-4">
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Evento: {webhook.evento}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{webhook.url}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => eliminarWebhook(webhook.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="rounded-md border p-4">
              <h4 className="mb-4 font-medium">Configurar nuevo webhook</h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="webhook-url">URL del webhook</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://api.empresa.com/webhooks/endpoint"
                    value={nuevoWebhookUrl}
                    onChange={(e) => setNuevoWebhookUrl(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="webhook-evento">Evento</Label>
                  <Select value={nuevoWebhookEvento} onValueChange={setNuevoWebhookEvento}>
                    <SelectTrigger id="webhook-evento">
                      <SelectValue placeholder="Selecciona un evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nuevo flujo">Nuevo flujo</SelectItem>
                      <SelectItem value="Validación fallida">Validación fallida</SelectItem>
                      <SelectItem value="Aprobación manual">Aprobación manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleGuardarWebhook}>Guardar webhook</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
