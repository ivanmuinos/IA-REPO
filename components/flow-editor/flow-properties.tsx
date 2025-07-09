"use client"

import type { FlowNode, FlowNodeData } from "@/types/flow"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface FlowPropertiesProps {
  selectedNode: FlowNode | null
  updateNodeData: (nodeId: string, data: FlowNodeData) => void
}

export function FlowProperties({ selectedNode, updateNodeData }: FlowPropertiesProps) {
  if (!selectedNode) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-muted-foreground">Seleccioná un paso para ver y editar sus propiedades</p>
        <p className="text-xs text-muted-foreground">
          Arrastrá un bloque desde la izquierda y hacé clic sobre él para personalizarlo aquí.
        </p>
      </div>
    )
  }

  const handleInputChange = (key: string, value: any) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, { ...selectedNode.data, [key]: value })
    }
  }

  // Propiedades específicas según el tipo de bloque
  switch (selectedNode.type) {
    case "ocr":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="block-name">Nombre del bloque</Label>
            <Input
              id="block-name"
              value={selectedNode.data.label || "OCR de documento"}
              onChange={(e) => handleInputChange("label", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="block-description">Descripción</Label>
            <Textarea
              id="block-description"
              value={selectedNode.data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción del bloque"
            />
          </div>

          <Accordion type="single" collapsible defaultValue="documentos">
            <AccordionItem value="documentos">
              <AccordionTrigger>Documentos aceptados</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dni"
                      checked={selectedNode.data.dni !== false}
                      onCheckedChange={(checked) => handleInputChange("dni", checked)}
                    />
                    <Label htmlFor="dni">DNI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pasaporte"
                      checked={selectedNode.data.pasaporte !== false}
                      onCheckedChange={(checked) => handleInputChange("pasaporte", checked)}
                    />
                    <Label htmlFor="pasaporte">Pasaporte</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="licencia"
                      checked={selectedNode.data.licencia === true}
                      onCheckedChange={(checked) => handleInputChange("licencia", checked)}
                    />
                    <Label htmlFor="licencia">Licencia de conducir</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="extranjero"
                      checked={selectedNode.data.extranjero === true}
                      onCheckedChange={(checked) => handleInputChange("extranjero", checked)}
                    />
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
                    <Switch
                      id="mrz"
                      checked={selectedNode.data.mrz !== false}
                      onCheckedChange={(checked) => handleInputChange("mrz", checked)}
                    />
                    <Label htmlFor="mrz">Validar MRZ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="caducidad"
                      checked={selectedNode.data.caducidad !== false}
                      onCheckedChange={(checked) => handleInputChange("caducidad", checked)}
                    />
                    <Label htmlFor="caducidad">Verificar caducidad</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autenticidad"
                      checked={selectedNode.data.autenticidad !== false}
                      onCheckedChange={(checked) => handleInputChange("autenticidad", checked)}
                    />
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
                    <Label htmlFor="umbral">Umbral de confianza: {selectedNode.data.umbral || 80}%</Label>
                    <Slider
                      id="umbral"
                      min={50}
                      max={100}
                      step={1}
                      value={[selectedNode.data.umbral || 80]}
                      onValueChange={(value) => handleInputChange("umbral", value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Comportamiento si falla</Label>
                    <RadioGroup
                      value={selectedNode.data.comportamientoFallo || "retry"}
                      onValueChange={(value) => handleInputChange("comportamientoFallo", value)}
                    >
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
            <Input
              id="block-name"
              value={selectedNode.data.label || "Validación biométrica"}
              onChange={(e) => handleInputChange("label", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="block-description">Descripción</Label>
            <Textarea
              id="block-description"
              value={selectedNode.data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción del bloque"
            />
          </div>

          <Accordion type="single" collapsible defaultValue="verificaciones">
            <AccordionItem value="verificaciones">
              <AccordionTrigger>Verificaciones</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="facial"
                      checked={selectedNode.data.facial !== false}
                      onCheckedChange={(checked) => handleInputChange("facial", checked)}
                    />
                    <Label htmlFor="facial">Comparación facial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="liveness"
                      checked={selectedNode.data.liveness !== false}
                      onCheckedChange={(checked) => handleInputChange("liveness", checked)}
                    />
                    <Label htmlFor="liveness">Prueba de vida</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="gestos"
                      checked={selectedNode.data.gestos === true}
                      onCheckedChange={(checked) => handleInputChange("gestos", checked)}
                    />
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
                    <Input
                      id="titulo"
                      value={selectedNode.data.titulo || "Verificación facial"}
                      onChange={(e) => handleInputChange("titulo", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={
                        selectedNode.data.descripcionInstrucciones ||
                        "Por favor, mira a la cámara y sigue las instrucciones para completar la verificación facial."
                      }
                      onChange={(e) => handleInputChange("descripcionInstrucciones", e.target.value)}
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
                    <Label htmlFor="umbralSimilitud">
                      Umbral de similitud: {selectedNode.data.umbralSimilitud || 85}%
                    </Label>
                    <Slider
                      id="umbralSimilitud"
                      min={50}
                      max={100}
                      step={1}
                      value={[selectedNode.data.umbralSimilitud || 85]}
                      onValueChange={(value) => handleInputChange("umbralSimilitud", value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proveedor">Proveedor de biometría</Label>
                    <Select
                      value={selectedNode.data.proveedor || "interno"}
                      onValueChange={(value) => handleInputChange("proveedor", value)}
                    >
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
            <Input
              id="flow-name"
              value={selectedNode.data.flowName || "Nuevo flujo de onboarding"}
              onChange={(e) => handleInputChange("flowName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flow-description">Descripción</Label>
            <Textarea
              id="flow-description"
              value={selectedNode.data.flowDescription || ""}
              onChange={(e) => handleInputChange("flowDescription", e.target.value)}
              placeholder="Descripción del flujo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flow-type">Tipo de flujo</Label>
            <Select
              value={selectedNode.data.flowType || "kyc"}
              onValueChange={(value) => handleInputChange("flowType", value)}
            >
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
                <Switch
                  id="recolectar-datos"
                  checked={selectedNode.data.recolectarDatos !== false}
                  onCheckedChange={(checked) => handleInputChange("recolectarDatos", checked)}
                />
                <Label htmlFor="recolectar-datos">Recolectar datos básicos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="terminos"
                  checked={selectedNode.data.terminos !== false}
                  onCheckedChange={(checked) => handleInputChange("terminos", checked)}
                />
                <Label htmlFor="terminos">Aceptación de términos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="privacidad"
                  checked={selectedNode.data.privacidad !== false}
                  onCheckedChange={(checked) => handleInputChange("privacidad", checked)}
                />
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
            <Label htmlFor="block-name">Nombre del bloque</Label>
            <Input
              id="block-name"
              value={selectedNode.data.label || "Fin del flujo"}
              onChange={(e) => handleInputChange("label", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Mensajes de finalización</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exito-titulo">Título (éxito)</Label>
                <Input
                  id="exito-titulo"
                  value={selectedNode.data.exitoTitulo || "¡Verificación completada!"}
                  onChange={(e) => handleInputChange("exitoTitulo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exito-mensaje">Mensaje (éxito)</Label>
                <Textarea
                  id="exito-mensaje"
                  value={
                    selectedNode.data.exitoMensaje ||
                    "Tu identidad ha sido verificada correctamente. Gracias por completar el proceso."
                  }
                  onChange={(e) => handleInputChange("exitoMensaje", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error-titulo">Título (error)</Label>
                <Input
                  id="error-titulo"
                  value={selectedNode.data.errorTitulo || "Verificación no completada"}
                  onChange={(e) => handleInputChange("errorTitulo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error-mensaje">Mensaje (error)</Label>
                <Textarea
                  id="error-mensaje"
                  value={
                    selectedNode.data.errorMensaje ||
                    "No hemos podido completar la verificación de tu identidad. Por favor, intenta nuevamente o contacta con soporte para recibir asistencia."
                  }
                  onChange={(e) => handleInputChange("errorMensaje", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Acciones finales</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="webhook"
                  checked={selectedNode.data.webhook !== false}
                  onCheckedChange={(checked) => handleInputChange("webhook", checked)}
                />
                <Label htmlFor="webhook">Enviar webhook de resultado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="email"
                  checked={selectedNode.data.email !== false}
                  onCheckedChange={(checked) => handleInputChange("email", checked)}
                />
                <Label htmlFor="email">Enviar email de confirmación</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="redirect"
                  checked={selectedNode.data.redirect !== false}
                  onCheckedChange={(checked) => handleInputChange("redirect", checked)}
                />
                <Label htmlFor="redirect">Redireccionar al finalizar</Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="redirect-url">URL de redirección</Label>
            <Input
              id="redirect-url"
              value={selectedNode.data.redirectUrl || "https://ejemplo.com/onboarding-completado"}
              onChange={(e) => handleInputChange("redirectUrl", e.target.value)}
            />
          </div>
        </div>
      )

    case "listas":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="block-name">Nombre del bloque</Label>
            <Input
              id="block-name"
              value={selectedNode.data.label || "Validación contra listas"}
              onChange={(e) => handleInputChange("label", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="block-description">Descripción</Label>
            <Textarea
              id="block-description"
              value={selectedNode.data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción del bloque"
            />
          </div>

          <Accordion type="single" collapsible defaultValue="listas">
            <AccordionItem value="listas">
              <AccordionTrigger>Listas a verificar</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pep"
                      checked={selectedNode.data.pep !== false}
                      onCheckedChange={(checked) => handleInputChange("pep", checked)}
                    />
                    <Label htmlFor="pep">PEP (Personas Expuestas Políticamente)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sanciones"
                      checked={selectedNode.data.sanciones !== false}
                      onCheckedChange={(checked) => handleInputChange("sanciones", checked)}
                    />
                    <Label htmlFor="sanciones">Listas de sanciones</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="terrorismo"
                      checked={selectedNode.data.terrorismo !== false}
                      onCheckedChange={(checked) => handleInputChange("terrorismo", checked)}
                    />
                    <Label htmlFor="terrorismo">Listas de terrorismo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fraude"
                      checked={selectedNode.data.fraude === true}
                      onCheckedChange={(checked) => handleInputChange("fraude", checked)}
                    />
                    <Label htmlFor="fraude">Listas de fraude</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comportamiento">
              <AccordionTrigger>Comportamiento</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Si se encuentra en alguna lista</Label>
                    <RadioGroup
                      value={selectedNode.data.comportamientoListas || "manual"}
                      onValueChange={(value) => handleInputChange("comportamientoListas", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual-listas" />
                        <Label htmlFor="manual-listas">Enviar a revisión manual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reject" id="reject-listas" />
                        <Label htmlFor="reject-listas">Rechazar automáticamente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="continue" id="continue-listas" />
                        <Label htmlFor="continue-listas">Continuar con advertencia</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="proveedores">
              <AccordionTrigger>Proveedores</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="proveedor-listas">Proveedor de listas</Label>
                    <Select
                      value={selectedNode.data.proveedorListas || "interno"}
                      onValueChange={(value) => handleInputChange("proveedorListas", value)}
                    >
                      <SelectTrigger id="proveedor-listas">
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interno">Base de datos interna</SelectItem>
                        <SelectItem value="worldcheck">Thomson Reuters World-Check</SelectItem>
                        <SelectItem value="refinitiv">Refinitiv</SelectItem>
                        <SelectItem value="dow-jones">Dow Jones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )

    case "revision":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="block-name">Nombre del bloque</Label>
            <Input
              id="block-name"
              value={selectedNode.data.label || "Revisión manual"}
              onChange={(e) => handleInputChange("label", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="block-description">Descripción</Label>
            <Textarea
              id="block-description"
              value={selectedNode.data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción del bloque"
            />
          </div>

          <Accordion type="single" collapsible defaultValue="configuracion">
            <AccordionItem value="configuracion">
              <AccordionTrigger>Configuración</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="tiempo-espera">Tiempo máximo de espera (minutos)</Label>
                    <Input
                      id="tiempo-espera"
                      type="number"
                      value={selectedNode.data.tiempoEspera || "30"}
                      onChange={(e) => handleInputChange("tiempoEspera", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Si se excede el tiempo de espera</Label>
                    <RadioGroup
                      value={selectedNode.data.comportamientoTimeout || "continue"}
                      onValueChange={(value) => handleInputChange("comportamientoTimeout", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="continue" id="continue-timeout" />
                        <Label htmlFor="continue-timeout">Continuar automáticamente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reject" id="reject-timeout" />
                        <Label htmlFor="reject-timeout">Rechazar automáticamente</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notificaciones">
              <AccordionTrigger>Notificaciones</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="notificar-email"
                      checked={selectedNode.data.notificarEmail !== false}
                      onCheckedChange={(checked) => handleInputChange("notificarEmail", checked)}
                    />
                    <Label htmlFor="notificar-email">Notificar por email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="notificar-slack"
                      checked={selectedNode.data.notificarSlack === true}
                      onCheckedChange={(checked) => handleInputChange("notificarSlack", checked)}
                    />
                    <Label htmlFor="notificar-slack">Notificar por Slack</Label>
                  </div>
                  {selectedNode.data.notificarSlack && (
                    <div className="space-y-2 mt-2 pl-6">
                      <Label htmlFor="canal-slack">Canal de Slack</Label>
                      <Input
                        id="canal-slack"
                        value={selectedNode.data.canalSlack || "#verificaciones"}
                        onChange={(e) => handleInputChange("canalSlack", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )

    case "decision":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="block-name">Nombre del bloque</Label>
            <Input
              id="block-name"
              value={selectedNode.data.label || "Decisión automática"}
              onChange={(e) => handleInputChange("label", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="block-description">Descripción</Label>
            <Textarea
              id="block-description"
              value={selectedNode.data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción del bloque"
            />
          </div>

          <Accordion type="single" collapsible defaultValue="reglas">
            <AccordionItem value="reglas">
              <AccordionTrigger>Reglas de decisión</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Condición de aprobación</Label>
                    <RadioGroup
                      value={selectedNode.data.condicionAprobacion || "all"}
                      onValueChange={(value) => handleInputChange("condicionAprobacion", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all-conditions" />
                        <Label htmlFor="all-conditions">Todas las verificaciones exitosas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="majority" id="majority-conditions" />
                        <Label htmlFor="majority-conditions">Mayoría de verificaciones exitosas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom-conditions" />
                        <Label htmlFor="custom-conditions">Reglas personalizadas</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {selectedNode.data.condicionAprobacion === "custom" && (
                    <div className="space-y-2 border p-3 rounded-md">
                      <Label htmlFor="reglas-personalizadas">Reglas personalizadas</Label>
                      <Textarea
                        id="reglas-personalizadas"
                        value={selectedNode.data.reglasPersonalizadas || "ocr.score > 80 AND biometria.score > 75"}
                        onChange={(e) => handleInputChange("reglasPersonalizadas", e.target.value)}
                        placeholder="Escribe las reglas usando operadores AND, OR, >, <, ="
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Ejemplo: ocr.score &gt; 80 AND biometria.score &gt; 75
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="acciones">
              <AccordionTrigger>Acciones</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Si se aprueba</Label>
                    <Select
                      value={selectedNode.data.accionAprobacion || "continue"}
                      onValueChange={(value) => handleInputChange("accionAprobacion", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar acción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continue">Continuar al siguiente paso</SelectItem>
                        <SelectItem value="finish">Finalizar flujo con éxito</SelectItem>
                        <SelectItem value="webhook">Enviar webhook y continuar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Si se rechaza</Label>
                    <Select
                      value={selectedNode.data.accionRechazo || "finish"}
                      onValueChange={(value) => handleInputChange("accionRechazo", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar acción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finish">Finalizar flujo con error</SelectItem>
                        <SelectItem value="retry">Permitir reintento</SelectItem>
                        <SelectItem value="manual">Enviar a revisión manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )

    case "mensaje":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="block-name">Nombre del bloque</Label>
            <Input
              id="block-name"
              value={selectedNode.data.label || "Mensaje personalizado"}
              onChange={(e) => handleInputChange("label", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="block-description">Descripción</Label>
            <Textarea
              id="block-description"
              value={selectedNode.data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción del bloque"
            />
          </div>

          <Accordion type="single" collapsible defaultValue="contenido">
            <AccordionItem value="contenido">
              <AccordionTrigger>Contenido del mensaje</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="titulo-mensaje">Título</Label>
                    <Input
                      id="titulo-mensaje"
                      value={selectedNode.data.tituloMensaje || "Información importante"}
                      onChange={(e) => handleInputChange("tituloMensaje", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cuerpo-mensaje">Cuerpo del mensaje</Label>
                    <Textarea
                      id="cuerpo-mensaje"
                      value={selectedNode.data.cuerpoMensaje || "Este es un mensaje informativo para el usuario."}
                      onChange={(e) => handleInputChange("cuerpoMensaje", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo-mensaje">Tipo de mensaje</Label>
                    <Select
                      value={selectedNode.data.tipoMensaje || "info"}
                      onValueChange={(value) => handleInputChange("tipoMensaje", value)}
                    >
                      <SelectTrigger id="tipo-mensaje">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Informativo</SelectItem>
                        <SelectItem value="warning">Advertencia</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="success">Éxito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="acciones">
              <AccordionTrigger>Acciones</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="texto-boton">Texto del botón</Label>
                    <Input
                      id="texto-boton"
                      value={selectedNode.data.textoBoton || "Continuar"}
                      onChange={(e) => handleInputChange("textoBoton", e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiere-confirmacion"
                      checked={selectedNode.data.requiereConfirmacion === true}
                      onCheckedChange={(checked) => handleInputChange("requiereConfirmacion", checked)}
                    />
                    <Label htmlFor="requiere-confirmacion">Requiere confirmación explícita</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
