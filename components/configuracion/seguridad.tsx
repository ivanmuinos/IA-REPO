"use client"

import { useState } from "react"
import { Eye, EyeOff, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export function Seguridad() {
  const { toast } = useToast()
  const [passwordActual, setPasswordActual] = useState("")
  const [passwordNueva, setPasswordNueva] = useState("")
  const [passwordConfirmar, setPasswordConfirmar] = useState("")
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [verificacionDosFactores, setVerificacionDosFactores] = useState(false)
  const [limitarAccesoIP, setLimitarAccesoIP] = useState(false)
  const [ipPermitidas, setIpPermitidas] = useState("")

  const handleCambiarPassword = () => {
    if (!passwordActual) {
      toast({
        title: "Error",
        description: "Por favor, ingresa tu contraseña actual",
        variant: "destructive",
      })
      return
    }

    if (passwordNueva.length < 8) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      })
      return
    }

    if (passwordNueva !== passwordConfirmar) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    // Simulación de cambio de contraseña exitoso
    setPasswordActual("")
    setPasswordNueva("")
    setPasswordConfirmar("")

    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada correctamente",
    })
  }

  const handleGuardarAjustes = () => {
    // Validar formato CIDR si está activado el límite por IP
    if (limitarAccesoIP && ipPermitidas) {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/
      const ips = ipPermitidas.split(",").map((ip) => ip.trim())

      for (const ip of ips) {
        if (!ipRegex.test(ip)) {
          toast({
            title: "Error",
            description: `El formato de IP "${ip}" no es válido. Usa formato CIDR (ej: 192.168.1.0/24)`,
            variant: "destructive",
          })
          return
        }
      }
    }

    toast({
      title: "Ajustes guardados",
      description: "Los ajustes de seguridad han sido guardados correctamente",
    })
  }

  const handleReestablecerValores = () => {
    setVerificacionDosFactores(false)
    setLimitarAccesoIP(false)
    setIpPermitidas("")

    toast({
      title: "Valores reestablecidos",
      description: "Los ajustes de seguridad han sido reestablecidos a los valores por defecto",
    })
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
          <CardDescription>Actualiza tu contraseña de administrador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="password-actual">Contraseña actual</Label>
            <div className="relative">
              <Input
                id="password-actual"
                type={mostrarPassword ? "text" : "password"}
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password-nueva">Nueva contraseña</Label>
            <Input
              id="password-nueva"
              type={mostrarPassword ? "text" : "password"}
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password-confirmar">Confirmar nueva contraseña</Label>
            <Input
              id="password-confirmar"
              type={mostrarPassword ? "text" : "password"}
              value={passwordConfirmar}
              onChange={(e) => setPasswordConfirmar(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCambiarPassword}>Cambiar contraseña</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seguridad y permisos</CardTitle>
          <CardDescription>Configura opciones avanzadas de seguridad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="verificacion-dos-factores">Verificación en dos pasos (2FA)</Label>
              <p className="text-sm text-muted-foreground">Requiere un código adicional al iniciar sesión</p>
            </div>
            <Switch
              id="verificacion-dos-factores"
              checked={verificacionDosFactores}
              onCheckedChange={setVerificacionDosFactores}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="limitar-acceso-ip">Limitar acceso por IP</Label>
                <p className="text-sm text-muted-foreground">Restringe el acceso a direcciones IP específicas</p>
              </div>
              <Switch id="limitar-acceso-ip" checked={limitarAccesoIP} onCheckedChange={setLimitarAccesoIP} />
            </div>

            {limitarAccesoIP && (
              <div className="grid gap-2">
                <Label htmlFor="ip-permitidas">IPs permitidas (separadas por comas)</Label>
                <Input
                  id="ip-permitidas"
                  placeholder="192.168.1.0/24, 10.0.0.1"
                  value={ipPermitidas}
                  onChange={(e) => setIpPermitidas(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Usa formato CIDR (ej: 192.168.1.0/24) para rangos de IP</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" onClick={handleReestablecerValores}>
            Reestablecer valores por defecto
          </Button>
          <Button onClick={handleGuardarAjustes}>
            <Save className="mr-2 h-4 w-4" />
            Guardar ajustes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
