import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FlowPropertiesProps {
  selectedBlock: string | null
}

export function FlowProperties({ selectedBlock }: FlowPropertiesProps) {
  if (!selectedBlock) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Selecciona un bloque para ver y editar sus propiedades
      </div>
    )
  }

  // Propiedades específicas según el tipo de bloque
  switch (selectedBlock) {
    case "ocr":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="block-name">Nombre del bloque</Label>
            <Input id="block-name" defaultValue="OCR de documento" />
          </div>

          <Accordion type="single" collapsible defaultValue="documentos">
            <AccordionItem value="documentos">
              <AccordionTrigger>Documentos aceptados</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="dni" defaultChecked />
                    <Label htmlFor="dni">DNI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="pasaporte" defaultChecked />
                    <Label htmlFor="pasaporte">Pasaporte</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="licencia" />
                    <Label htmlFor="licencia">Licencia de conducir</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="extranjero" />
                    <Label htmlFor="extranjero">Documento extranjero</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="validaciones">
              <AccordionTrigger>Validaciones</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="mrz" defaultChecked />
                    <Label htmlFor="mrz">Validar MRZ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="caducidad" defaultChecked />
                    <Label htmlFor="caducidad">Verificar caducidad</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="autenticidad" defaultChecked />
                    <Label htmlFor="autenticidad">Comprobar autenticidad</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="avanzado">
              <AccordionTrigger>Configuración avanzada</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="umbral">Umbral de confianza (%)</Label>
                    <Input id="umbral" type="number" defaultValue="80" />
                  </div>
                  <div className="space-y-2">
                    <Label>Comportamiento si falla</Label>
                    <RadioGroup defaultValue="retry">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="retry" id="retry" />
                        <Label htmlFor="retry">Permitir reintentos (máx. 3)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual">Enviar a revisión manual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reject" id="reject" />
                        <Label htmlFor="reject">Rechazar automáticamente</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )

    case "biometria":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="block-name">Nombre del bloque</Label>
            <Input id="block-name" defaultValue="Validación biométrica" />
          </div>

          <Accordion type="single" collapsible defaultValue="verificaciones">
            <AccordionItem value="verificaciones">
              <AccordionTrigger>Verificaciones</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="facial" defaultChecked />
                    <Label htmlFor="facial">Comparación facial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="liveness" defaultChecked />
                    <Label htmlFor="liveness">Prueba de vida</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="gestos" />
                    <Label htmlFor="gestos">Gestos aleatorios</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="instrucciones">
              <AccordionTrigger>Instrucciones</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título</Label>
                    <Input id="titulo" defaultValue="Verificación facial" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      defaultValue="Por favor, mira a la cámara y sigue las instrucciones para completar la verificación facial."
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="avanzado">
              <AccordionTrigger>Configuración avanzada</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="umbral">Umbral de similitud (%)</Label>
                    <Input id="umbral" type="number" defaultValue="85" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proveedor">Proveedor de biometría</Label>
                    <Select defaultValue="interno">
                      <SelectTrigger id="proveedor">
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interno">Motor interno</SelectItem>
                        <SelectItem value="aws">AWS Rekognition</SelectItem>
                        <SelectItem value="azure">Azure Face</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )

    case "inicio":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="flow-name">Nombre del flujo</Label>
            <Input id="flow-name" defaultValue="KYC Básico" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flow-description">Descripción</Label>
            <Textarea
              id="flow-description"
              defaultValue="Flujo de verificación de identidad básico con OCR de documento y validación biométrica."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flow-type">Tipo de flujo</Label>
            <Select defaultValue="kyc">
              <SelectTrigger id="flow-type">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kyc">KYC (Personas)</SelectItem>
                <SelectItem value="kyb">KYB (Empresas)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Configuración inicial</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="recolectar-datos" defaultChecked />
                <Label htmlFor="recolectar-datos">Recolectar datos básicos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="terminos" defaultChecked />
                <Label htmlFor="terminos">Aceptación de términos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="privacidad" defaultChecked />
                <Label htmlFor="privacidad">Política de privacidad</Label>
              </div>
            </div>
          </div>
        </div>
      )

    case "fin":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Mensajes de finalización</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exito-titulo">Título (éxito)</Label>
                <Input id="exito-titulo" defaultValue="¡Verificación completada!" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exito-mensaje">Mensaje (éxito)</Label>
                <Textarea
                  id="exito-mensaje"
                  defaultValue="Tu identidad ha sido verificada correctamente. Gracias por completar el proceso."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error-titulo">Título (error)</Label>
                <Input id="error-titulo" defaultValue="Verificación no completada" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error-mensaje">Mensaje (error)</Label>
                <Textarea
                  id="error-mensaje"
                  defaultValue="No hemos podido completar la verificación de tu identidad. Por favor, intenta nuevamente o contacta con soporte para recibir asistencia."
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Acciones finales</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="webhook" defaultChecked />
                <Label htmlFor="webhook">Enviar webhook de resultado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="email" defaultChecked />
                <Label htmlFor="email">Enviar email de confirmación</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="redirect" defaultChecked />
                <Label htmlFor="redirect">Redireccionar al finalizar</Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="redirect-url">URL de redirección</Label>
            <Input id="redirect-url" defaultValue="https://ejemplo.com/onboarding-completado" />
          </div>
        </div>
      )

    default:
      return (
        <div className="text-center py-8 text-muted-foreground">
          Propiedades no disponibles para este tipo de bloque
        </div>
      )
  }
}
