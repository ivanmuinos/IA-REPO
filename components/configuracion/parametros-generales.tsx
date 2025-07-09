"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const tiemposExpiracion = [
  { value: "15", label: "15 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "60", label: "1 hora" },
  { value: "120", label: "2 horas" },
]

const idiomas = [
  { value: "es", label: "Español" },
  { value: "pt", label: "Portugués" },
  { value: "en", label: "Inglés" },
]

const formatosFecha = [
  { value: "dd/mm/yyyy", label: "DD/MM/AAAA" },
  { value: "mm/dd/yyyy", label: "MM/DD/YYYY" },
  { value: "yyyy-mm-dd", label: "AAAA-MM-DD" },
]

const formatosHora = [
  { value: "24h", label: "24h" },
  { value: "ampm", label: "AM/PM" },
]

export function ParametrosGenerales() {
  const { toast } = useToast()
  const [tiempoExpiracion, setTiempoExpiracion] = useState("30")
  const [idioma, setIdioma] = useState("es")
  const [formatoFecha, setFormatoFecha] = useState("dd/mm/yyyy")
  const [formatoHora, setFormatoHora] = useState("24h")

  const [openTiempo, setOpenTiempo] = useState(false)
  const [openIdioma, setOpenIdioma] = useState(false)
  const [openFormatoFecha, setOpenFormatoFecha] = useState(false)
  const [openFormatoHora, setOpenFormatoHora] = useState(false)

  const handleGuardarConfiguracion = () => {
    toast({
      title: "Configuración guardada",
      description: "Los parámetros generales han sido guardados correctamente",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros generales</CardTitle>
        <CardDescription>Configura los parámetros básicos del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tiempo de expiración de sesión
          </label>
          <Popover open={openTiempo} onOpenChange={setOpenTiempo}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openTiempo} className="justify-between">
                {tiempoExpiracion
                  ? tiemposExpiracion.find((tiempo) => tiempo.value === tiempoExpiracion)?.label
                  : "Seleccionar tiempo..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Buscar tiempo..." />
                <CommandList>
                  <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                  <CommandGroup>
                    {tiemposExpiracion.map((tiempo) => (
                      <CommandItem
                        key={tiempo.value}
                        value={tiempo.value}
                        onSelect={(currentValue) => {
                          setTiempoExpiracion(currentValue)
                          setOpenTiempo(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            tiempoExpiracion === tiempo.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {tiempo.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Idioma por defecto del sistema
          </label>
          <Popover open={openIdioma} onOpenChange={setOpenIdioma}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openIdioma} className="justify-between">
                {idioma ? idiomas.find((i) => i.value === idioma)?.label : "Seleccionar idioma..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Buscar idioma..." />
                <CommandList>
                  <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                  <CommandGroup>
                    {idiomas.map((i) => (
                      <CommandItem
                        key={i.value}
                        value={i.value}
                        onSelect={(currentValue) => {
                          setIdioma(currentValue)
                          setOpenIdioma(false)
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", idioma === i.value ? "opacity-100" : "opacity-0")} />
                        {i.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Formato de fechas
            </label>
            <Popover open={openFormatoFecha} onOpenChange={setOpenFormatoFecha}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openFormatoFecha} className="justify-between">
                  {formatoFecha ? formatosFecha.find((f) => f.value === formatoFecha)?.label : "Seleccionar formato..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Buscar formato..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup>
                      {formatosFecha.map((f) => (
                        <CommandItem
                          key={f.value}
                          value={f.value}
                          onSelect={(currentValue) => {
                            setFormatoFecha(currentValue)
                            setOpenFormatoFecha(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", formatoFecha === f.value ? "opacity-100" : "opacity-0")}
                          />
                          {f.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Formato de hora
            </label>
            <Popover open={openFormatoHora} onOpenChange={setOpenFormatoHora}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openFormatoHora} className="justify-between">
                  {formatoHora ? formatosHora.find((f) => f.value === formatoHora)?.label : "Seleccionar formato..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Buscar formato..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup>
                      {formatosHora.map((f) => (
                        <CommandItem
                          key={f.value}
                          value={f.value}
                          onSelect={(currentValue) => {
                            setFormatoHora(currentValue)
                            setOpenFormatoHora(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", formatoHora === f.value ? "opacity-100" : "opacity-0")}
                          />
                          {f.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGuardarConfiguracion}>
          <Save className="mr-2 h-4 w-4" />
          Guardar configuración
        </Button>
      </CardFooter>
    </Card>
  )
}
