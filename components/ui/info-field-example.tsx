import { InfoField, InfoFieldWithBadge } from "@/components/ui/info-field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * EJEMPLO DE USO DE COMPONENTES INFOFIELD
 * 
 * Este archivo muestra cómo usar los componentes InfoField y InfoFieldWithBadge
 * para mantener consistencia en toda la plataforma.
 * 
 * PATRÓN ESTÁNDAR:
 * - Todos los campos de información deben usar InfoField o InfoFieldWithBadge
 * - Los campos son readonly por defecto
 * - Usar tipos apropiados (email, tel, date, etc.)
 * - Aplicar clases CSS específicas cuando sea necesario (font-mono, etc.)
 */

export function InfoFieldExample() {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de uso - Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo básico */}
          <InfoField
            label="Nombre"
            value="Juan Pérez González"
          />
          
          {/* Campo con tipo específico */}
          <InfoField
            label="Email"
            value="juan.perez@ejemplo.com"
            type="email"
          />
          
          {/* Campo con tipo teléfono */}
          <InfoField
            label="Teléfono"
            value="+34 612 345 678"
            type="tel"
          />
          
          {/* Campo con clase CSS específica */}
          <InfoField
            label="Documento"
            value="12345678A"
            className="font-mono"
          />
          
          {/* Campo con badge */}
          <InfoFieldWithBadge
            label="Tipo de documento"
            value="DNI"
            badgeText="DNI"
          />
          
          {/* Campo de fecha */}
          <InfoField
            label="Fecha de nacimiento"
            value="1990-03-12"
            type="date"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de uso - Información de Empresa</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            label="Nombre de la empresa"
            value="Empresa XYZ S.L."
          />
          
          <InfoField
            label="CIF/NIF"
            value="B12345678"
            className="font-mono"
          />
          
          <InfoField
            label="Email corporativo"
            value="contacto@empresaxyz.com"
            type="email"
          />
          
          <InfoField
            label="Teléfono"
            value="+34 912 345 678"
            type="tel"
          />
          
          <InfoField
            label="Dirección"
            value="Calle Principal 123, 28001 Madrid"
          />
          
          <InfoField
            label="Fecha de constitución"
            value="2010-03-10"
            type="date"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de uso - Información Técnica</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            label="Dirección IP"
            value="192.168.1.100"
            className="font-mono"
          />
          
          <InfoField
            label="Coordenadas"
            value="40.4168° N, 3.7038° W"
            className="font-mono"
          />
          
          <InfoField
            label="Dispositivo"
            value="Smartphone - Samsung Galaxy S23"
          />
          
          <InfoField
            label="Sistema Operativo"
            value="Android 13"
          />
          
          <InfoField
            label="Navegador"
            value="Chrome 120.0.0.0"
          />
          
          <InfoField
            label="Resolución"
            value="1080x2400"
            className="font-mono"
          />
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * REGLAS DE USO:
 * 
 * 1. SIEMPRE usar InfoField en lugar de <p> para mostrar información
 * 2. Usar InfoFieldWithBadge cuando necesites mostrar un badge junto al campo
 * 3. Especificar el tipo apropiado: "email", "tel", "date", "url", "number"
 * 4. Usar className="font-mono" para códigos, documentos, IPs, etc.
 * 5. Los campos son readonly por defecto (readOnly={true})
 * 6. Mantener consistencia en el espaciado y layout
 * 
 * EJEMPLOS DE APLICACIÓN:
 * - Páginas de detalle de personas
 * - Páginas de detalle de jurídico
 * - Formularios de configuración
 * - Paneles de información
 * - Cualquier lugar donde se muestre información en formato campo-valor
 */ 