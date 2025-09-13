type Constructor<T = {}> = new (...args: any[]) => T
type ServiceFactory<T> = () => T
type ServiceIdentifier<T> = Constructor<T> | string | symbol

interface ServiceRegistration<T> {
  factory: ServiceFactory<T>
  singleton: boolean
  instance?: T
}

export class DIContainer {
  private services = new Map<ServiceIdentifier<any>, ServiceRegistration<any>>()

  /**
   * Register a service with the container
   */
  register<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    options: { singleton?: boolean } = {}
  ): void {
    this.services.set(identifier, {
      factory,
      singleton: options.singleton ?? true,
    })
  }

  /**
   * Register a class constructor with automatic dependency resolution
   */
  registerClass<T>(
    constructor: Constructor<T>,
    options: { singleton?: boolean } = {}
  ): void {
    this.register(
      constructor,
      () => {
        // For now, we'll handle dependency resolution manually in the factory
        // In a more advanced implementation, you could use reflection/decorators
        return new constructor()
      },
      options
    )
  }

  /**
   * Resolve a service from the container
   */
  resolve<T>(identifier: ServiceIdentifier<T>): T {
    const registration = this.services.get(identifier)

    if (!registration) {
      throw new Error(`Service ${String(identifier)} is not registered`)
    }

    if (registration.singleton) {
      if (!registration.instance) {
        registration.instance = registration.factory()
      }
      return registration.instance
    }

    return registration.factory()
  }

  /**
   * Check if a service is registered
   */
  has<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.services.has(identifier)
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clear(): void {
    this.services.clear()
  }
}

// Export a default container instance
export const container = new DIContainer()

// Service identifiers (tokens)
export const TOKENS = {
  LOGGER: Symbol("Logger"),
  DATABASE: Symbol("Database"),

  // Hanlders
  USER_HANDLER: Symbol("UserHandler"),

  // Services
  USER_SERVICE: Symbol("UserService"),

  // Repositories
  USER_REPOSITORY: Symbol("UserRepository"),
} as const
