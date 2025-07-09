"use client"

import { useState } from "react"
import { MoreHorizontal, UserPlus } from "lucide-react"

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

// Datos de ejemplo para usuarios
const usuariosIniciales = [
  { id: 1, nombre: "Ana Martínez", email: "ana.martinez@empresa.com", rol: "Admin", estado: "Activo" },
  { id: 2, nombre: "Carlos López", email: "carlos.lopez@empresa.com", rol: "Editor", estado: "Activo" },
  { id: 3, nombre: "María García", email: "maria.garcia@empresa.com", rol: "Solo lectura", estado: "Activo" },
  { id: 4, nombre: "Juan Pérez", email: "juan.perez@empresa.com", rol: "Editor", estado: "Suspendido" },
]

export function UsuariosRoles() {
  const { toast } = useToast()
  const [usuarios, setUsuarios] = useState(usuariosIniciales)
  const [nuevoEmail, setNuevoEmail] = useState("")
  const [nuevoRol, setNuevoRol] = useState("Editor")
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleInvitarUsuario = () => {
    if (!nuevoEmail || !nuevoEmail.includes("@")) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un email válido",
        variant: "destructive",
      })
      return
    }

    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre: nuevoEmail
        .split("@")[0]
        .replace(".", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      email: nuevoEmail,
      rol: nuevoRol,
      estado: "Activo",
    }

    setUsuarios([...usuarios, nuevoUsuario])
    setNuevoEmail("")
    setNuevoRol("Editor")
    setDialogOpen(false)

    toast({
      title: "Usuario invitado",
      description: `Se ha enviado una invitación a ${nuevoEmail}`,
    })
  }

  const cambiarEstadoUsuario = (id: number) => {
    setUsuarios(
      usuarios.map((usuario) => {
        if (usuario.id === id) {
          const nuevoEstado = usuario.estado === "Activo" ? "Suspendido" : "Activo"
          return { ...usuario, estado: nuevoEstado }
        }
        return usuario
      }),
    )

    const usuario = usuarios.find((u) => u.id === id)
    if (usuario) {
      toast({
        title: `Usuario ${usuario.estado === "Activo" ? "suspendido" : "activado"}`,
        description: `${usuario.nombre} ha sido ${usuario.estado === "Activo" ? "suspendido" : "activado"} correctamente`,
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de usuarios y roles</CardTitle>
          <CardDescription>Administra los usuarios que tienen acceso al sistema y sus permisos</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Agregar nuevo usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invitar nuevo usuario</DialogTitle>
              <DialogDescription>
                Envía una invitación por email para que un nuevo usuario se una al sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={nuevoEmail}
                  onChange={(e) => setNuevoEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rol">Rol</Label>
                <Select value={nuevoRol} onValueChange={setNuevoRol}>
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Administrador</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Solo lectura">Solo lectura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleInvitarUsuario}>Enviar invitación</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Rol</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b">
                  <td className="px-4 py-3 text-sm">{usuario.nombre}</td>
                  <td className="px-4 py-3 text-sm">{usuario.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      variant={usuario.rol === "Admin" ? "default" : usuario.rol === "Editor" ? "outline" : "secondary"}
                    >
                      {usuario.rol}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={usuario.estado === "Activo" ? "success" : "destructive"}>{usuario.estado}</Badge>
                  </td>
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
                        <DropdownMenuItem>Editar usuario</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => cambiarEstadoUsuario(usuario.id)}>
                          {usuario.estado === "Activo" ? "Desactivar" : "Activar"} usuario
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
  )
}
