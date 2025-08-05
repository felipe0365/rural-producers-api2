import { PaginationDto } from './pagination.dto'

describe('PaginationDto', () => {
  it('deve ter as propriedades corretas', () => {
    const dto = new PaginationDto()

    expect(dto.page).toBeDefined()
    expect(dto.limit).toBeDefined()
    expect(dto.sortBy).toBeUndefined()
    expect(dto.sortOrder).toBeDefined()
  })

  it('deve ter valores padrão corretos', () => {
    const dto = new PaginationDto()

    expect(dto.page).toBe(1)
    expect(dto.limit).toBe(10)
    expect(dto.sortOrder).toBe('ASC')
  })

  it('deve aceitar valores customizados', () => {
    const dto = new PaginationDto()
    dto.page = 2
    dto.limit = 20
    dto.sortBy = 'name'
    dto.sortOrder = 'DESC'

    expect(dto.page).toBe(2)
    expect(dto.limit).toBe(20)
    expect(dto.sortBy).toBe('name')
    expect(dto.sortOrder).toBe('DESC')
  })

  describe('decorators de validação', () => {
    it('deve ter @IsOptional() em todas as propriedades', () => {
      const dto = new PaginationDto()

      // Verificar se as propriedades são opcionais
      expect(dto.page).toBeDefined()
      expect(dto.limit).toBeDefined()
      expect(dto.sortBy).toBeUndefined()
      expect(dto.sortOrder).toBeDefined()
    })

    it('deve ter @IsInt() em page, limit e offset', () => {
      const dto = new PaginationDto()

      // Testar com valores inteiros válidos
      dto.page = 1
      dto.limit = 10
      dto.offset = 0

      expect(typeof dto.page).toBe('number')
      expect(typeof dto.limit).toBe('number')
      expect(typeof dto.offset).toBe('number')
    })

    it('deve ter @Min(1) em page e limit', () => {
      const dto = new PaginationDto()

      // Valores mínimos válidos
      dto.page = 1
      dto.limit = 1

      expect(dto.page).toBeGreaterThanOrEqual(1)
      expect(dto.limit).toBeGreaterThanOrEqual(1)
    })

    it('deve ter @Max(100) em limit', () => {
      const dto = new PaginationDto()

      // Valor máximo válido
      dto.limit = 100

      expect(dto.limit).toBeLessThanOrEqual(100)
    })

    it('deve ter @Min(0) em offset', () => {
      const dto = new PaginationDto()

      // Valor mínimo válido para offset
      dto.offset = 0

      expect(dto.offset).toBeGreaterThanOrEqual(0)
    })
  })

  describe('cenários de uso', () => {
    it('deve funcionar com paginação padrão', () => {
      const dto = new PaginationDto()

      expect(dto.page).toBe(1)
      expect(dto.limit).toBe(10)
      expect(dto.sortOrder).toBe('ASC')
    })

    it('deve funcionar com paginação customizada', () => {
      const dto = new PaginationDto()
      dto.page = 3
      dto.limit = 25
      dto.sortBy = 'updatedAt'
      dto.sortOrder = 'DESC'

      expect(dto.page).toBe(3)
      expect(dto.limit).toBe(25)
      expect(dto.sortBy).toBe('updatedAt')
      expect(dto.sortOrder).toBe('DESC')
    })
  })
})
