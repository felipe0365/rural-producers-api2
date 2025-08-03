import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

interface ChartDataPoint {
  name: string
  value: number
}

export interface DashboardData {
  totalFarms: number
  totalArea: number
  byState: ChartDataPoint[]
  byCulture: ChartDataPoint[]
  byLandUse: {
    arableArea: number
    vegetationArea: number
  }
}

export interface Producer {
  id: string
  document: string
  documentType: 'CPF' | 'CNPJ'
  producerName: string
  farms: Farm[]
  createdAt: string
  updatedAt: string
}

export interface CreateProducerDto {
  document: string
  documentType: 'CPF' | 'CNPJ'
  producerName: string
  farms: CreateFarmDto[]
}

export interface UpdateProducerDto {
  document?: string
  documentType?: 'CPF' | 'CNPJ'
  producerName?: string
  farms?: CreateFarmDto[]
}

// Interfaces para Fazendas
export interface Farm {
  id: string
  farmName: string
  city: string
  state: string
  totalArea: number
  arableArea: number
  vegetationArea: number
  plantedCrops: PlantedCrop[]
  producerId: string
  createdAt: string
  updatedAt: string
}

export interface CreateFarmDto {
  farmName: string
  city: string
  state: string
  totalArea: number
  arableArea: number
  vegetationArea: number
  plantedCrops: CreatePlantedCropDto[]
}

// Interfaces para Culturas Plantadas
export interface PlantedCrop {
  id: string
  harvest: string
  cultures: string[]
  farmId: string
  createdAt: string
  updatedAt: string
}

export interface CreatePlantedCropDto {
  harvest: string
  cultures: string[]
}

// Interfaces para Paginação e Filtros
export interface PaginationDto {
  page: number
  limit: number
}

export interface FilterProducerDto {
  producerName?: string
  document?: string
  documentType?: 'CPF' | 'CNPJ'
}

export interface PaginatedResponseDto<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Serviços da API
export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await apiClient.get('/api/dashboard')
  return response.data
}

// Produtores
export const getProducers = async (
  pagination: PaginationDto,
  filters: FilterProducerDto = {},
): Promise<PaginatedResponseDto<Producer>> => {
  const params = new URLSearchParams({
    page: pagination.page.toString(),
    limit: pagination.limit.toString(),
    ...filters,
  })
  const response = await apiClient.get(`/api/producers?${params}`)
  return response.data
}

export const getProducer = async (id: string): Promise<Producer> => {
  const response = await apiClient.get(`/api/producers/${id}`)
  return response.data
}

export const createProducer = async (data: CreateProducerDto): Promise<Producer> => {
  const response = await apiClient.post('/api/producers', data)
  return response.data
}

export const updateProducer = async (id: string, data: UpdateProducerDto): Promise<Producer> => {
  const response = await apiClient.patch(`/api/producers/${id}`, data)
  return response.data
}

export const deleteProducer = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/producers/${id}`)
}

// Estados brasileiros para o select
export const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

// Culturas comuns
export const commonCultures = [
  'Soja',
  'Milho',
  'Café',
  'Cana-de-açúcar',
  'Arroz',
  'Feijão',
  'Trigo',
  'Algodão',
  'Laranja',
  'Uva',
  'Banana',
  'Manga',
  'Abacaxi',
  'Coco',
  'Cacau',
  'Eucalipto',
  'Pinus',
  'Pastagem',
]
