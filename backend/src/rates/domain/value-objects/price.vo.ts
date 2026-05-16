class InvalidPriceError extends Error {
  constructor(value: number) {
    super(`Invalid price: ${value}. Must be a finite number greater than 0`)
    this.name = 'InvalidPriceError'
  }
}

class Price {
  private constructor(private readonly value: number) {}

  static create(value: number): Price {
    if (value <= 0 || !Number.isFinite(value)) throw new InvalidPriceError(value)
    return new Price(value)
  }

  getValue(): number {
    return this.value
  }
}

export { Price, InvalidPriceError }
