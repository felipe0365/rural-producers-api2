jest.mock('planted-crops/entities/planted-crop.entity', () => {
  return {
    PlantedCrop: jest.fn().mockImplementation(() => ({
      id: 'mock-planted-crop-id',
      plantedArea: 100,
      harvestYear: 2024,
    })),
  }
})

jest.mock('culture/entities/culture.entity', () => {
  return {
    Culture: jest.fn().mockImplementation(() => ({
      id: 'mock-culture-id',
      name: 'Mock Culture',
    })),
  }
})

jest.mock('farms/entities/farm.entity', () => {
  return {
    Farm: jest.fn().mockImplementation(() => ({
      id: 'mock-farm-id',
      farmName: 'Mock Farm',
      city: 'Mock City',
      state: 'Mock State',
      totalArea: 1000,
      arableArea: 800,
      vegetationArea: 200,
    })),
  }
})

jest.mock('producers/entities/producer.entity', () => {
  return {
    Producer: jest.fn().mockImplementation(() => ({
      id: 'mock-producer-id',
      producerName: 'Mock Producer',
      document: '12345678901',
      documentType: 'CPF',
    })),
    DocumentType: {
      CPF: 'CPF',
      CNPJ: 'CNPJ',
    },
  }
})
