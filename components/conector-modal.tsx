"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Esquema de validación
const conectorSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").min(3, "El nombre debe tener al menos 3 caracteres"),
  tipo: z.enum(["webhook", "slack", "email", "zapier"]),
  url: z.string().url("Debe ser una URL válida").optional(),
  canal: z.string().optional(),
  asunto: z.string().optional(),
  plantilla: z.string().optional(),
  zapWebhook: z.string().url("Debe ser una URL válida").optional(),
}).refine((data) => {
  if (data.tipo === "webhook" && !data.url) {
    return false
  }
  if (data.tipo === "slack" && (!data.url || !data.canal)) {
    return false
  }
  if (data.tipo === "email" && (!data.asunto || !data.plantilla)) {
    return false
  }
  if (data.tipo === "zapier" && !data.zapWebhook) {
    return false
  }
  return true
}, {
  message: "Todos los campos son requeridos para el tipo seleccionado"
})

type ConectorFormData = z.infer<typeof conectorSchema>

interface ConectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConectorModal({ open, onOpenChange }: ConectorModalProps) {
  const form = useForm<ConectorFormData>({
    resolver: zodResolver(conectorSchema),
    defaultValues: {
      nombre: "",
      tipo: "webhook",
      url: "",
      canal: "",
      asunto: "",
      plantilla: "",
      zapWebhook: "",
    },
  })

  const tipo = form.watch("tipo")

  const onSubmit = (data: ConectorFormData) => {
    // console.log("Datos del conector:", data)
    // Aquí iría la lógica para guardar el conector
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar nuevo conector</DialogTitle>
          <DialogDescription>Conecta tu flujo de onboarding con servicios externos</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del conector</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Webhook de aprobación" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de conector</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="webhook" id="webhook" />
                        <Label htmlFor="webhook">Webhook HTTP</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="slack" id="slack" />
                        <Label htmlFor="slack">Slack</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="zapier" id="zapier" />
                        <Label htmlFor="zapier">Zapier</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tipo === "webhook" && (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del webhook</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormDescription>
                      La URL donde se enviarán las notificaciones HTTP POST
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {tipo === "slack" && (
              <>
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL del webhook de Slack</FormLabel>
                      <FormControl>
                        <Input placeholder="https://hooks.slack.com/services/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canal</FormLabel>
                      <FormControl>
                        <Input placeholder="#verificaciones" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {tipo === "email" && (
              <>
                <FormField
                  control={form.control}
                  name="asunto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asunto del email</FormLabel>
                      <FormControl>
                        <Input placeholder="Resultado de verificación" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plantilla"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plantilla de email</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Contenido del email..." className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {tipo === "zapier" && (
              <FormField
                control={form.control}
                name="zapWebhook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del webhook de Zapier</FormLabel>
                    <FormControl>
                      <Input placeholder="https://hooks.zapier.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                Guardar conector
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
