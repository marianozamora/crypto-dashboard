type Price = {
  readonly value: number
  readonly _brand: 'Price'
}

class InvalidPriceError extends Error {
  constructor(value: number) {
    super(`Price must be positive and finite, got ${value}`)
    this.name = 'InvalidPriceError'
  }
}

const createPrice = (value: number): Price => {
  if (value <= 0 || !Number.isFinite(value)) throw new InvalidPriceError(value)
  return { value, _brand: 'Price' }
}

export { createPrice, InvalidPriceError }
export type { Price }
