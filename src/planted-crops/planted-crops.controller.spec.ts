import { Test, TestingModule } from '@nestjs/testing';
import { PlantedCropsController } from './planted-crops.controller';
import { PlantedCropsService } from './planted-crops.service';

describe('PlantedCropsController', () => {
  let controller: PlantedCropsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantedCropsController],
      providers: [PlantedCropsService],
    }).compile();

    controller = module.get<PlantedCropsController>(PlantedCropsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
