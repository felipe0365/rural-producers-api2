import { IsCpfOrCnpj } from './is-cpf-or-cnpj.validator'

describe('IsCpfOrCnpj', () => {
  let validator: IsCpfOrCnpj

  beforeEach(() => {
    validator = new IsCpfOrCnpj()
  })

  describe('validate', () => {
    it('deve retornar true para CPF válido', () => {
      const result = validator.validate('47449630567')
      expect(result).toBe(true)
    })

    it('deve retornar true para CNPJ válido', () => {
      const result = validator.validate('12345678000195')
      expect(result).toBe(true)
    })

    it('deve retornar false para documento inválido', () => {
      const result = validator.validate('12345678901')
      expect(result).toBe(false)
    })

    it('deve retornar false para string vazia', () => {
      const result = validator.validate('')
      expect(result).toBe(false)
    })

    it('deve retornar false para null', () => {
      const result = validator.validate(null as any)
      expect(result).toBe(false)
    })

    it('deve retornar false para undefined', () => {
      const result = validator.validate(undefined as any)
      expect(result).toBe(false)
    })

    it('deve retornar false para string com apenas números repetidos', () => {
      const result = validator.validate('11111111111')
      expect(result).toBe(false)
    })

    it('deve retornar false para string com apenas números repetidos (CNPJ)', () => {
      const result = validator.validate('11111111111111')
      expect(result).toBe(false)
    })
  })

  describe('defaultMessage', () => {
    it('deve retornar mensagem de erro padrão', () => {
      const message = validator.defaultMessage()
      expect(message).toBe('Documento inválido. Deve ser um CPF ou CNPJ válido.')
    })
  })
})
