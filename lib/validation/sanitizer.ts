import DOMPurify from "isomorphic-dompurify"

export class DataSanitizer {
  /**
   * Sanitiza texto eliminando caracteres peligrosos y normalizando espacios
   */
  static sanitizeText(text: string): string {
    if (!text || typeof text !== "string") return ""

    // Eliminar caracteres de control y normalizar espacios
    let sanitized = text
      .replace(/[\x00-\x1F\x7F]/g, "") // Eliminar caracteres de control
      .replace(/\s+/g, " ") // Normalizar espacios múltiples
      .trim()

    // Sanitizar HTML si existe
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    })

    return sanitized
  }

  /**
   * Sanitiza email eliminando espacios y convirtiendo a minúsculas
   */
  static sanitizeEmail(email: string): string {
    if (!email || typeof email !== "string") return ""

    return email.toLowerCase().trim().replace(/\s+/g, "")
  }

  /**
   * Sanitiza número de teléfono eliminando caracteres no numéricos excepto +
   */
  static sanitizePhone(phone: string): string {
    if (!phone || typeof phone !== "string") return ""

    return phone.replace(/[^\d+]/g, "").trim()
  }

  /**
   * Sanitiza documento eliminando espacios y caracteres especiales
   */
  static sanitizeDocument(document: string): string {
    if (!document || typeof document !== "string") return ""

    return document
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .trim()
  }

  /**
   * Sanitiza nombre eliminando caracteres especiales pero manteniendo acentos
   */
  static sanitizeName(name: string): string {
    if (!name || typeof name !== "string") return ""

    return name
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  /**
   * Sanitiza dirección IP
   */
  static sanitizeIP(ip: string): string {
    if (!ip || typeof ip !== "string") return ""

    return ip.replace(/[^0-9.]/g, "").trim()
  }

  /**
   * Sanitiza coordenadas geográficas
   */
  static sanitizeCoordinates(coords: string): string {
    if (!coords || typeof coords !== "string") return ""

    return coords
      .replace(/[^0-9.,-\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  /**
   * Sanitiza objeto completo aplicando las reglas apropiadas
   */
  static sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized = { ...obj }

    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === "string") {
        // Aplicar sanitización específica según el campo
        if (key.toLowerCase().includes("email")) {
          sanitized[key] = this.sanitizeEmail(value)
        } else if (key.toLowerCase().includes("phone") || key.toLowerCase().includes("telefono")) {
          sanitized[key] = this.sanitizePhone(value)
        } else if (key.toLowerCase().includes("document") || key.toLowerCase().includes("documento")) {
          sanitized[key] = this.sanitizeDocument(value)
        } else if (
          key.toLowerCase().includes("name") ||
          key.toLowerCase().includes("nombre") ||
          key.toLowerCase().includes("apellido")
        ) {
          sanitized[key] = this.sanitizeName(value)
        } else if (key.toLowerCase().includes("ip")) {
          sanitized[key] = this.sanitizeIP(value)
        } else if (key.toLowerCase().includes("coordenada")) {
          sanitized[key] = this.sanitizeCoordinates(value)
        } else {
          sanitized[key] = this.sanitizeText(value)
        }
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeObject(value)
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === "object" && item !== null
            ? this.sanitizeObject(item)
            : typeof item === "string"
              ? this.sanitizeText(item)
              : item,
        )
      }
    }

    return sanitized
  }
}
