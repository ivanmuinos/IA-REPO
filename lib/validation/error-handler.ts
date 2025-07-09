import { ZodError } from "zod"

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface DataOperationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationError[]
  message?: string
}

export class DataValidationError extends Error {
  public errors: ValidationError[]

  constructor(errors: ValidationError[]) {
    super("Errores de validación de datos")
    this.name = "DataValidationError"
    this.errors = errors
  }
}

export class DataIntegrityError extends Error {
  public code: string

  constructor(message: string, code = "INTEGRITY_ERROR") {
    super(message)
    this.name = "DataIntegrityError"
    this.code = code
  }
}

export class ErrorHandler {
  /**
   * Convierte errores de Zod a formato estándar
   */
  static formatZodError(error: ZodError): ValidationError[] {
    return error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
      code: err.code,
    }))
  }

  /**
   * Maneja errores de base de datos de Supabase
   */
  static handleSupabaseError(error: any): DataOperationResult<never> {
    console.error("Supabase error:", error)

    // Errores de violación de restricciones
    if (error.code === "23505") {
      return {
        success: false,
        errors: [
          {
            field: "general",
            message: "Ya existe un registro con estos datos",
            code: "DUPLICATE_ENTRY",
          },
        ],
        message: "Datos duplicados",
      }
    }

    // Errores de clave foránea
    if (error.code === "23503") {
      return {
        success: false,
        errors: [
          {
            field: "general",
            message: "Referencia a datos inexistentes",
            code: "FOREIGN_KEY_VIOLATION",
          },
        ],
        message: "Error de integridad referencial",
      }
    }

    // Errores de conexión
    if (error.message?.includes("connection") || error.message?.includes("network")) {
      return {
        success: false,
        errors: [
          {
            field: "general",
            message: "Error de conexión con la base de datos",
            code: "CONNECTION_ERROR",
          },
        ],
        message: "Error de conexión",
      }
    }

    // Error genérico
    return {
      success: false,
      errors: [
        {
          field: "general",
          message: error.message || "Error desconocido en la base de datos",
          code: "DATABASE_ERROR",
        },
      ],
      message: "Error en la base de datos",
    }
  }

  /**
   * Crea un resultado exitoso
   */
  static success<T>(data: T, message?: string): DataOperationResult<T> {
    return {
      success: true,
      data,
      message,
    }
  }

  /**
   * Crea un resultado de error
   */
  static error(errors: ValidationError[], message?: string): DataOperationResult<never> {
    return {
      success: false,
      errors,
      message,
    }
  }

  /**
   * Valida y sanitiza datos usando un schema de Zod
   */
  static validateAndSanitize<T>(data: unknown, schema: any, sanitize = true): DataOperationResult<T> {
    try {
      // Sanitizar datos si se solicita
      const processedData =
        sanitize && typeof data === "object" && data !== null
          ? require("./sanitizer").DataSanitizer.sanitizeObject(data)
          : data

      // Validar con schema
      const validatedData = schema.parse(processedData)

      return this.success(validatedData)
    } catch (error) {
      if (error instanceof ZodError) {
        return this.error(this.formatZodError(error), "Errores de validación en los datos")
      }

      return this.error(
        [
          {
            field: "general",
            message: "Error inesperado durante la validación",
            code: "VALIDATION_ERROR",
          },
        ],
        "Error de validación",
      )
    }
  }
}
