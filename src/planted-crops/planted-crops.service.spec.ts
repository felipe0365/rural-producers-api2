import { Test, TestingModule } from '@nestjs/testing';
import { PlantedCropsService } from './planted-crops.service';

describe('PlantedCropsService', () => {
  let service: PlantedCropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantedCropsService],
    }).compile();

    service = module.get<PlantedCropsService>(PlantedCropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
