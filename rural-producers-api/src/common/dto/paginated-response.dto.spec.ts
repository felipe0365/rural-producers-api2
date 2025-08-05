import { PaginatedResponseDto } from './paginated-response.dto'

describe('PaginatedResponseDto', () => {
  it('deve criar uma instância com dados válidos', () => {
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]
    const page = 1
    const limit = 10
    const total = 2

    const response = new PaginatedResponseDto(data, page, limit, total)

    expect(response.data).toEqual(data)
    expect(response.meta.page).toBe(page)
    expect(response.meta.limit).toBe(limit)
    expect(response.meta.total).toBe(total)
    expect(response.meta.totalPages).toBe(1)
    expect(response.meta.hasNext).toBe(false)
    expect(response.meta.hasPrev).toBe(false)
  })

  it('deve calcular totalPages corretamente', () => {
    const data = []
    const page = 1
    const limit = 10
    const total = 25

    const response = new PaginatedResponseDto(data, page, limit, total)

    expect(response.meta.totalPages).toBe(3) // Math.ceil(25 / 10) = 3
  })

  it('deve calcular hasNext corretamente', () => {
    const data = []
    const page = 1
    const limit = 10
    const total = 25

    const response = new PaginatedResponseDto(data, page, limit, total)

    expect(response.meta.hasNext).toBe(true) // page (1) < totalPages (3)
  })

  it('deve calcular hasPrev corretamente', () => {
    const data = []
    const page = 2
    const limit = 10
    const total = 25

    const response = new PaginatedResponseDto(data, page, limit, total)

    expect(response.meta.hasPrev).toBe(true) // page (2) > 1
  })

  it('deve retornar false para hasNext na última página', () => {
    const data = []
    const page = 3
    const limit = 10
    const total = 25

    const response = new PaginatedResponseDto(data, page, limit, total)

    expect(response.meta.hasNext).toBe(false) // page (3) >= totalPages (3)
  })

  it('deve retornar false para hasPrev na primeira página', () => {
    const data = []
    const page = 1
    const limit = 10
    const total = 25

    const response = new PaginatedResponseDto(data, page, limit, total)

    expect(response.meta.hasPrev).toBe(false) // page (1) <= 1
  })

  it('deve lidar com total zero', () => {
    const data = []
    const page = 1
    const limit = 10
    const total = 0

    const response = new PaginatedResponseDto(data, page, limit, total)

    expect(response.meta.totalPages).toBe(0)
    expect(response.meta.hasNext).toBe(false)
    expect(response.meta.hasPrev).toBe(false)
  })

  it('deve lidar com valores padrão', () => {
    const data = []

    const response = new PaginatedResponseDto(data, 1, 10, 0)

    expect(response.meta.page).toBe(1)
    expect(response.meta.limit).toBe(10)
    expect(response.meta.total).toBe(0)
  })
})
