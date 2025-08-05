import { AreaValidator } from './area.validator'
import { ValidationArguments } from 'class-validator'

describe('AreaValidator', () => {
  let validator: AreaValidator

  beforeEach(() => {
    validator = new AreaValidator()
  })

  describe('validate', () => {
    it('deve retornar true para áreas válidas', () => {
      const args = {
        object: {
          totalArea: 100,
          arableArea: 60,
          vegetationArea: 30,
        },
      } as ValidationArguments

      const result = validator.validate(args)
      expect(result).toBe(true)
    })

    it('deve retornar true quando soma é igual à área total', () => {
      const args = {
        object: {
          totalArea: 100,
          arableArea: 70,
          vegetationArea: 30,
        },
      } as ValidationArguments

      const result = validator.validate(args)
      expect(result).toBe(true)
    })

    it('deve retornar false quando soma é maior que área total', () => {
      const args = {
        object: {
          totalArea: 100,
          arableArea: 80,
          vegetationArea: 30,
        },
      } as ValidationArguments

      const result = validator.validate(args)
      expect(result).toBe(false)
    })

    it('deve retornar true quando áreas são zero', () => {
      const args = {
        object: {
          totalArea: 0,
          arableArea: 0,
          vegetationArea: 0,
        },
      } as ValidationArguments

      const result = validator.validate(args)
      expect(result).toBe(true)
    })

    it('deve lidar com valores undefined', () => {
      const args = {
        object: {
          totalArea: undefined,
          arableArea: undefined,
          vegetationArea: undefined,
        },
      } as ValidationArguments

      const result = validator.validate(args)
      expect(result).toBe(true) // 0 + 0 <= 0
    })

    it('deve lidar com valores null', () => {
      const args = {
        object: {
          totalArea: null,
          arableArea: null,
          vegetationArea: null,
        },
      } as ValidationArguments

      const result = validator.validate(args)
      expect(result).toBe(true) // 0 + 0 <= 0
    })

    it('deve lidar com valores string', () => {
      const args = {
        object: {
          totalArea: '100',
          arableArea: '60',
          vegetationArea: '30',
        },
      } as ValidationArguments

      const result = validator.validate(args)
      expect(result).toBe(true)
    })

    it('deve retornar false para soma inválida com strings', () => {
      const args = {
        object: {
          totalArea: '100',
          arableArea: '80',
          vegetationArea: '30',
        },
      } as ValidationArguments

      const result = validator.validate(args)
      expect(result).toBe(false)
    })
  })

  describe('defaultMessage', () => {
    it('deve retornar mensagem de erro padrão', () => {
      const message = validator.defaultMessage()
      expect(message).toBe('A soma da área agricultável e de vegetação não pode ser maior que a área total da fazenda.')
    })
  })
})
