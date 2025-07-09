export interface Persona {
  id: number
  nombre: string
  documento: string
  flujo: string
  fecha: string
  estado: "completado" | "en-progreso" | "revision" | "abandonado" | "rechazado" | "aprobado"
  progreso: number
  email: string
  telefono: string
  pasos: Array<{
    id: string
    nombre: string
    estado: "completado" | "revision" | "pendiente"
    tiempo: string
    timestamp: string
  }>
  datosOCR: {
    nombre: string
    apellidos: string
    documento: string
    tipoDocumento: string
    fechaNacimiento: string
    fechaExpedicion: string
    fechaCaducidad: string
    nacionalidad: string
  }
  perfilRiesgo: {
    nivelRiesgo: "Alto" | "Medio" | "Bajo"
    compliance: "Aprobado" | "Rechazado" | "Pendiente"
    perfilTransaccional: string
  }
  geolocalizacion: {
    pais: string
    ciudad: string
    coordenadas: string
    direccionIP: string
    proveedor: string
  }
  dispositivoInfo: {
    tipo: string
    modelo: string
    sistemaOperativo: string
    navegador: string
    resolucion: string
    userAgent: string
  }
  resultados: {
    ocr: {
      resultado: string
      confianza: string
      observaciones: string
    }
    biometria: {
      resultado: string
      confianza: string
      observaciones: string
    }
  }
  blacklistBiometrico?: boolean
  motivoRechazo?: string
  hashBiometrico?: string
}

// Mock data for personas
const personasData: Persona[] = [
  {
    id: 1,
    nombre: "Juan Pérez González",
    documento: "12345678A",
    flujo: "KYC Básico",
    fecha: "15/05/2023 14:32",
    estado: "completado",
    progreso: 100,
    email: "juan.perez@ejemplo.com",
    telefono: "+34 612 345 678",
    pasos: [
      {
        id: "inicio",
        nombre: "Inicio del flujo",
        estado: "completado",
        tiempo: "8s",
        timestamp: "14:32:00",
      },
      {
        id: "ocr",
        nombre: "OCR de documento",
        estado: "completado",
        tiempo: "42s",
        timestamp: "14:32:42",
      },
      {
        id: "biometria",
        nombre: "Validación biométrica",
        estado: "completado",
        tiempo: "28s",
        timestamp: "14:33:10",
      },
      {
        id: "fin",
        nombre: "Final del flujo",
        estado: "completado",
        tiempo: "5s",
        timestamp: "14:33:15",
      },
    ],
    datosOCR: {
      nombre: "Juan",
      apellidos: "Pérez González",
      documento: "12345678A",
      tipoDocumento: "DNI",
      fechaNacimiento: "12/03/1990",
      fechaExpedicion: "15/01/2020",
      fechaCaducidad: "15/01/2030",
      nacionalidad: "Española",
    },
    perfilRiesgo: {
      nivelRiesgo: "Bajo",
      compliance: "Aprobado",
      perfilTransaccional: "Estándar",
    },
    geolocalizacion: {
      pais: "España",
      ciudad: "Madrid",
      coordenadas: "40.4168, -3.7038",
      direccionIP: "85.123.45.67",
      proveedor: "Movistar España",
    },
    dispositivoInfo: {
      tipo: "Smartphone",
      modelo: "Samsung Galaxy S23",
      sistemaOperativo: "Android 13",
      navegador: "Chrome 118.0",
      resolucion: "1080x2340",
      userAgent: "Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36",
    },
    resultados: {
      ocr: {
        resultado: "Válido",
        confianza: "98%",
        observaciones: "Documento en excelente estado, todos los campos legibles",
      },
      biometria: {
        resultado: "Válido",
        confianza: "94%",
        observaciones: "Coincidencia facial confirmada",
      },
    },
    hashBiometrico: "50d4de30-3ccf-11f0-a290-69d270c20f98",
  },
  {
    id: 2,
    nombre: "María López Martínez",
    documento: "87654321B",
    flujo: "KYC Premium",
    fecha: "15/05/2023 16:45",
    estado: "en-progreso",
    progreso: 60,
    email: "maria.lopez@ejemplo.com",
    telefono: "+34 698 765 432",
    pasos: [
      {
        id: "inicio",
        nombre: "Inicio del flujo",
        estado: "completado",
        tiempo: "12s",
        timestamp: "16:45:00",
      },
      {
        id: "ocr",
        nombre: "OCR de documento",
        estado: "completado",
        tiempo: "38s",
        timestamp: "16:45:38",
      },
      {
        id: "biometria",
        nombre: "Validación biométrica",
        estado: "revision",
        tiempo: "25s",
        timestamp: "16:46:03",
      },
      {
        id: "fin",
        nombre: "Final del flujo",
        estado: "pendiente",
        tiempo: "-",
        timestamp: "-",
      },
    ],
    datosOCR: {
      nombre: "María",
      apellidos: "López Martínez",
      documento: "87654321B",
      tipoDocumento: "DNI",
      fechaNacimiento: "28/07/1988",
      fechaExpedicion: "10/06/2019",
      fechaCaducidad: "10/06/2029",
      nacionalidad: "Española",
    },
    perfilRiesgo: {
      nivelRiesgo: "Medio",
      compliance: "Pendiente",
      perfilTransaccional: "Premium",
    },
    geolocalizacion: {
      pais: "España",
      ciudad: "Barcelona",
      coordenadas: "41.3851, 2.1734",
      direccionIP: "92.234.56.78",
      proveedor: "Orange España",
    },
    dispositivoInfo: {
      tipo: "Smartphone",
      modelo: "iPhone 14",
      sistemaOperativo: "iOS 16.6",
      navegador: "Safari 16.6",
      resolucion: "1170x2532",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)",
    },
    resultados: {
      ocr: {
        resultado: "Válido",
        confianza: "96%",
        observaciones: "Documento en buen estado",
      },
      biometria: {
        resultado: "En revisión",
        confianza: "78%",
        observaciones: "Similitud por debajo del umbral, requiere revisión manual",
      },
    },
    hashBiometrico: "7a8b9c2d-4e5f-12g3-b456-78h901i23j45",
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez García",
    documento: "11223344C",
    flujo: "KYC Básico",
    fecha: "14/05/2023 10:15",
    estado: "revision",
    progreso: 80,
    email: "carlos.rodriguez@ejemplo.com",
    telefono: "+34 612 345 678",
    pasos: [
      {
        id: "inicio",
        nombre: "Inicio del flujo",
        estado: "completado",
        tiempo: "10s",
        timestamp: "10:15:00",
      },
      {
        id: "ocr",
        nombre: "OCR de documento",
        estado: "completado",
        tiempo: "45s",
        timestamp: "10:15:45",
      },
      {
        id: "biometria",
        nombre: "Validación biométrica",
        estado: "revision",
        tiempo: "30s",
        timestamp: "10:16:15",
      },
      {
        id: "fin",
        nombre: "Final del flujo",
        estado: "pendiente",
        tiempo: "-",
        timestamp: "-",
      },
    ],
    datosOCR: {
      nombre: "Carlos",
      apellidos: "Rodríguez García",
      documento: "11223344C",
      tipoDocumento: "DNI",
      fechaNacimiento: "15/08/1985",
      fechaExpedicion: "20/03/2018",
      fechaCaducidad: "20/03/2028",
      nacionalidad: "Española",
    },
    perfilRiesgo: {
      nivelRiesgo: "Medio",
      compliance: "Aprobado",
      perfilTransaccional: "Estándar",
    },
    geolocalizacion: {
      pais: "Argentina",
      ciudad: "Buenos Aires",
      coordenadas: "-34.6118, -58.3960",
      direccionIP: "190.123.45.67",
      proveedor: "Telecom Argentina",
    },
    dispositivoInfo: {
      tipo: "Smartphone",
      modelo: "iPhone 14 Pro",
      sistemaOperativo: "iOS 16.4",
      navegador: "Safari 16.4",
      resolucion: "1179x2556",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X)",
    },
    resultados: {
      ocr: {
        resultado: "Válido",
        confianza: "95%",
        observaciones: "Documento en buen estado",
      },
      biometria: {
        resultado: "Revisión manual",
        confianza: "75%",
        observaciones: "Similitud por debajo del umbral",
      },
    },
    hashBiometrico: "k6l7m8n9-0p1q-23r4-c567-89s012t34u56",
  },
  {
    id: 4,
    nombre: "Ana Martínez Fernández",
    documento: "55667788D",
    flujo: "KYB Empresas",
    fecha: "14/05/2023 09:30",
    estado: "completado",
    progreso: 100,
    email: "ana.martinez@empresa.com",
    telefono: "+34 687 543 210",
    pasos: [
      {
        id: "inicio",
        nombre: "Inicio del flujo",
        estado: "completado",
        tiempo: "15s",
        timestamp: "09:30:00",
      },
      {
        id: "ocr",
        nombre: "OCR de documento",
        estado: "completado",
        tiempo: "52s",
        timestamp: "09:30:52",
      },
      {
        id: "biometria",
        nombre: "Validación biométrica",
        estado: "completado",
        tiempo: "35s",
        timestamp: "09:31:27",
      },
      {
        id: "fin",
        nombre: "Final del flujo",
        estado: "completado",
        tiempo: "8s",
        timestamp: "09:31:35",
      },
    ],
    datosOCR: {
      nombre: "Ana",
      apellidos: "Martínez Fernández",
      documento: "55667788D",
      tipoDocumento: "DNI",
      fechaNacimiento: "22/11/1982",
      fechaExpedicion: "05/09/2021",
      fechaCaducidad: "05/09/2031",
      nacionalidad: "Española",
    },
    perfilRiesgo: {
      nivelRiesgo: "Bajo",
      compliance: "Aprobado",
      perfilTransaccional: "Corporativo",
    },
    geolocalizacion: {
      pais: "España",
      ciudad: "Valencia",
      coordenadas: "39.4699, -0.3763",
      direccionIP: "78.142.33.44",
      proveedor: "Vodafone España",
    },
    dispositivoInfo: {
      tipo: "Tablet",
      modelo: "iPad Pro 12.9",
      sistemaOperativo: "iPadOS 16.5",
      navegador: "Safari 16.5",
      resolucion: "2048x2732",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
    resultados: {
      ocr: {
        resultado: "Válido",
        confianza: "99%",
        observaciones: "Documento nuevo, excelente calidad de imagen",
      },
      biometria: {
        resultado: "Válido",
        confianza: "96%",
        observaciones: "Coincidencia facial confirmada con alta confianza",
      },
    },
    hashBiometrico: "v7w8x9y0-1z2a-34b5-d678-90c123d45e67",
  },
  {
    id: 5,
    nombre: "Pedro Sánchez López",
    documento: "99887766E",
    flujo: "KYC Premium",
    fecha: "13/05/2023 17:20",
    estado: "abandonado",
    progreso: 40,
    email: "pedro.sanchez@ejemplo.com",
    telefono: "+34 654 321 987",
    pasos: [
      {
        id: "inicio",
        nombre: "Inicio del flujo",
        estado: "completado",
        tiempo: "18s",
        timestamp: "17:20:00",
      },
      {
        id: "ocr",
        nombre: "OCR de documento",
        estado: "completado",
        tiempo: "55s",
        timestamp: "17:20:55",
      },
      {
        id: "biometria",
        nombre: "Validación biométrica",
        estado: "pendiente",
        tiempo: "-",
        timestamp: "-",
      },
      {
        id: "fin",
        nombre: "Final del flujo",
        estado: "pendiente",
        tiempo: "-",
        timestamp: "-",
      },
    ],
    datosOCR: {
      nombre: "Pedro",
      apellidos: "Sánchez López",
      documento: "99887766E",
      tipoDocumento: "DNI",
      fechaNacimiento: "03/12/1975",
      fechaExpedicion: "12/04/2017",
      fechaCaducidad: "12/04/2027",
      nacionalidad: "Española",
    },
    perfilRiesgo: {
      nivelRiesgo: "Alto",
      compliance: "Pendiente",
      perfilTransaccional: "Premium",
    },
    geolocalizacion: {
      pais: "España",
      ciudad: "Sevilla",
      coordenadas: "37.3886, -5.9823",
      direccionIP: "83.56.78.90",
      proveedor: "Jazztel",
    },
    dispositivoInfo: {
      tipo: "Desktop",
      modelo: "Windows PC",
      sistemaOperativo: "Windows 11",
      navegador: "Edge 118.0",
      resolucion: "1920x1080",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    resultados: {
      ocr: {
        resultado: "Válido",
        confianza: "89%",
        observaciones: "Documento con ligero desgaste pero legible",
      },
      biometria: {
        resultado: "No completado",
        confianza: "N/A",
        observaciones: "Usuario abandonó el proceso antes de la validación biométrica",
      },
    },
    hashBiometrico: "f8g9h0i1-2j3k-45l6-e789-01m234n56o78",
  },
  {
    id: 6,
    nombre: "Lucas Ferreira",
    documento: "44556677F",
    flujo: "KYC Básico",
    fecha: "16/05/2023 11:20",
    estado: "rechazado",
    progreso: 75,
    email: "lucas.ferreira@ejemplo.com",
    telefono: "+34 611 222 333",
    blacklistBiometrico: true,
    motivoRechazo: "Deepfake – similitud 43%",
    pasos: [
      {
        id: "inicio",
        nombre: "Inicio del flujo",
        estado: "completado",
        tiempo: "12s",
        timestamp: "11:20:00",
      },
      {
        id: "ocr",
        nombre: "OCR de documento",
        estado: "completado",
        tiempo: "35s",
        timestamp: "11:20:35",
      },
      {
        id: "biometria",
        nombre: "Validación biométrica",
        estado: "completado",
        tiempo: "22s",
        timestamp: "11:20:57",
      },
      {
        id: "fin",
        nombre: "Final del flujo",
        estado: "pendiente",
        tiempo: "-",
        timestamp: "-",
      },
    ],
    datosOCR: {
      nombre: "Lucas",
      apellidos: "Ferreira",
      documento: "44556677F",
      tipoDocumento: "DNI",
      fechaNacimiento: "18/09/1992",
      fechaExpedicion: "22/02/2022",
      fechaCaducidad: "22/02/2032",
      nacionalidad: "Española",
    },
    perfilRiesgo: {
      nivelRiesgo: "Alto",
      compliance: "Rechazado",
      perfilTransaccional: "Estándar",
    },
    geolocalizacion: {
      pais: "España",
      ciudad: "Bilbao",
      coordenadas: "43.2627, -2.9253",
      direccionIP: "88.99.77.55",
      proveedor: "Euskaltel",
    },
    dispositivoInfo: {
      tipo: "Smartphone",
      modelo: "Xiaomi Redmi Note 12",
      sistemaOperativo: "Android 12",
      navegador: "Chrome 119.0",
      resolucion: "1080x2400",
      userAgent: "Mozilla/5.0 (Linux; Android 12; Redmi Note 12) AppleWebKit/537.36",
    },
    resultados: {
      ocr: {
        resultado: "Válido",
        confianza: "92%",
        observaciones: "Documento en buen estado",
      },
      biometria: {
        resultado: "Rechazado",
        confianza: "43%",
        observaciones: "Posible deepfake detectado - similitud muy baja",
      },
    },
    hashBiometrico: "p9q0r1s2-3t4u-56v7-f890-12w345x67y89",
  },
  {
    id: 7,
    nombre: "Mariana Duarte",
    documento: "77889900G",
    flujo: "KYC Premium",
    fecha: "16/05/2023 15:45",
    estado: "aprobado",
    progreso: 100,
    email: "mariana.duarte@ejemplo.com",
    telefono: "+34 622 333 444",
    motivoRechazo: undefined,
    pasos: [
      {
        id: "inicio",
        nombre: "Inicio del flujo",
        estado: "completado",
        tiempo: "9s",
        timestamp: "15:45:00",
      },
      {
        id: "ocr",
        nombre: "OCR de documento",
        estado: "completado",
        tiempo: "41s",
        timestamp: "15:45:41",
      },
      {
        id: "biometria",
        nombre: "Validación biométrica",
        estado: "completado",
        tiempo: "31s",
        timestamp: "15:46:12",
      },
      {
        id: "fin",
        nombre: "Final del flujo",
        estado: "completado",
        tiempo: "7s",
        timestamp: "15:46:19",
      },
    ],
    datosOCR: {
      nombre: "Mariana",
      apellidos: "Duarte",
      documento: "77889900G",
      tipoDocumento: "DNI",
      fechaNacimiento: "05/04/1987",
      fechaExpedicion: "12/08/2020",
      fechaCaducidad: "12/08/2030",
      nacionalidad: "Española",
    },
    perfilRiesgo: {
      nivelRiesgo: "Bajo",
      compliance: "Aprobado",
      perfilTransaccional: "Premium",
    },
    geolocalizacion: {
      pais: "España",
      ciudad: "Málaga",
      coordenadas: "36.7213, -4.4214",
      direccionIP: "95.123.88.99",
      proveedor: "Movistar España",
    },
    dispositivoInfo: {
      tipo: "Smartphone",
      modelo: "iPhone 15",
      sistemaOperativo: "iOS 17.1",
      navegador: "Safari 17.1",
      resolucion: "1179x2556",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X)",
    },
    resultados: {
      ocr: {
        resultado: "Válido",
        confianza: "97%",
        observaciones: "Documento en excelente estado, alta calidad de imagen",
      },
      biometria: {
        resultado: "Válido",
        confianza: "91%",
        observaciones: "Validación biométrica superada exitosamente",
      },
    },
    hashBiometrico: "z0a1b2c3-4d5e-67f8-g901-23h456i78j90",
  },
]

export class PersonasService {
  // Data integrity validation and correction
  private static validateAndCorrectData(): Persona[] {
    const correctedData: Persona[] = []
    const seenIds = new Set<number>()
    const seenDocuments = new Set<string>()
    const seenEmails = new Set<string>()

    for (const persona of personasData) {
      // Check for duplicate IDs
      if (seenIds.has(persona.id)) {
        console.warn(`Duplicate ID found: ${persona.id}. Skipping duplicate entry.`)
        continue
      }

      // Check for duplicate documents
      if (seenDocuments.has(persona.documento)) {
        console.warn(`Duplicate document found: ${persona.documento}. Skipping duplicate entry.`)
        continue
      }

      // Check for duplicate emails
      if (seenEmails.has(persona.email)) {
        console.warn(`Duplicate email found: ${persona.email}. Skipping duplicate entry.`)
        continue
      }

      // Validate data consistency
      const correctedPersona = this.validatePersonaData(persona)
      if (correctedPersona) {
        seenIds.add(correctedPersona.id)
        seenDocuments.add(correctedPersona.documento)
        seenEmails.add(correctedPersona.email)
        correctedData.push(correctedPersona)
      }
    }

    return correctedData
  }

  private static validatePersonaData(persona: Persona): Persona | null {
    try {
      // Ensure ID is a positive integer
      if (!Number.isInteger(persona.id) || persona.id <= 0) {
        console.error(`Invalid ID for persona: ${persona.id}`)
        return null
      }

      // Ensure required fields are present and valid
      if (!persona.nombre || typeof persona.nombre !== "string" || persona.nombre.trim().length === 0) {
        console.error(`Invalid name for persona ID ${persona.id}`)
        return null
      }

      if (!persona.documento || typeof persona.documento !== "string" || persona.documento.trim().length === 0) {
        console.error(`Invalid document for persona ID ${persona.id}`)
        return null
      }

      if (!persona.email || typeof persona.email !== "string" || !persona.email.includes("@")) {
        console.error(`Invalid email for persona ID ${persona.id}`)
        return null
      }

      // Ensure OCR data matches persona data
      if (persona.datosOCR.documento !== persona.documento) {
        console.warn(`Document mismatch for persona ID ${persona.id}. Correcting OCR data.`)
        persona.datosOCR.documento = persona.documento
      }

      // Ensure progress is within valid range
      if (persona.progreso < 0 || persona.progreso > 100) {
        console.warn(`Invalid progress for persona ID ${persona.id}. Correcting to valid range.`)
        persona.progreso = Math.max(0, Math.min(100, persona.progreso))
      }

      // Ensure estado and progreso are consistent
      if (persona.estado === "completado" && persona.progreso !== 100) {
        console.warn(`Progress inconsistency for completed persona ID ${persona.id}. Correcting progress to 100.`)
        persona.progreso = 100
      }

      const validStates: Persona["estado"][] = [
        "completado",
        "en-progreso",
        "revision",
        "abandonado",
        "rechazado",
        "aprobado",
      ]
      if (!validStates.includes(persona.estado)) {
        console.error(`Invalid state for persona ID ${persona.id}`)
        return null
      }

      return persona
    } catch (error) {
      console.error(`Error validating persona ID ${persona.id}:`, error)
      return null
    }
  }

  // Cache for validated data
  private static validatedData: Persona[] | null = null
  private static lastValidation = 0
  private static readonly VALIDATION_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private static getValidatedData(): Persona[] {
    const now = Date.now()

    // Return cached data if it's still valid
    if (this.validatedData && now - this.lastValidation < this.VALIDATION_CACHE_DURATION) {
      return this.validatedData
    }

    // Validate and cache data
    this.validatedData = this.validateAndCorrectData()
    this.lastValidation = now

    console.log(`Data validation completed. ${this.validatedData.length} valid personas found.`)
    return this.validatedData
  }

  static async getAllPersonas(): Promise<Persona[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return this.getValidatedData()
  }

  static async getPersonaById(id: number): Promise<Persona | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150))

    // Validate input ID
    if (!Number.isInteger(id) || id <= 0) {
      console.error(`Invalid ID provided: ${id}`)
      return null
    }

    const validatedData = this.getValidatedData()
    const persona = validatedData.find((p) => p.id === id)

    if (!persona) {
      console.warn(`Persona with ID ${id} not found`)
      return null
    }

    // Double-check data integrity before returning
    const validatedPersona = this.validatePersonaData({ ...persona })
    if (!validatedPersona) {
      console.error(`Data integrity check failed for persona ID ${id}`)
      return null
    }

    return validatedPersona
  }

  static async getPersonasByEstado(estado: string): Promise<Persona[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const validatedData = this.getValidatedData()
    return validatedData.filter((p) => p.estado === estado)
  }

  static async updatePersonaEstado(id: number, nuevoEstado: Persona["estado"]): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Validate input
    if (!Number.isInteger(id) || id <= 0) {
      console.error(`Invalid ID provided for update: ${id}`)
      return false
    }

    const validStates: Persona["estado"][] = [
      "completado",
      "en-progreso",
      "revision",
      "abandonado",
      "rechazado",
      "aprobado",
    ]
    if (!validStates.includes(nuevoEstado)) {
      console.error(`Invalid state provided: ${nuevoEstado}`)
      return false
    }

    const validatedData = this.getValidatedData()
    const persona = validatedData.find((p) => p.id === id)

    if (persona) {
      persona.estado = nuevoEstado
      if (nuevoEstado === "completado") {
        persona.progreso = 100
      }

      // Invalidate cache to force re-validation
      this.validatedData = null

      console.log(`Updated persona ID ${id} state to ${nuevoEstado}`)
      return true
    }

    console.error(`Persona with ID ${id} not found for update`)
    return false
  }

  static async exportPersonaData(id: number): Promise<string> {
    const persona = await this.getPersonaById(id)
    if (!persona) {
      throw new Error(`Persona with ID ${id} not found`)
    }
    return JSON.stringify(persona, null, 2)
  }

  // New method to check data integrity
  static async checkDataIntegrity(): Promise<{
    isValid: boolean
    issues: string[]
    totalPersonas: number
    validPersonas: number
  }> {
    const issues: string[] = []
    const originalCount = personasData.length
    const validatedData = this.getValidatedData()
    const validCount = validatedData.length

    if (originalCount !== validCount) {
      issues.push(`${originalCount - validCount} personas were removed due to data integrity issues`)
    }

    // Check for ID sequence gaps
    const ids = validatedData.map((p) => p.id).sort((a, b) => a - b)
    for (let i = 1; i < ids.length; i++) {
      if (ids[i] - ids[i - 1] > 1) {
        issues.push(`ID sequence gap detected between ${ids[i - 1]} and ${ids[i]}`)
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      totalPersonas: originalCount,
      validPersonas: validCount,
    }
  }
}
