import { PartialType } from '@nestjs/swagger';
import { CreatePlantedCropDto } from './create-planted-crop.dto';

export class UpdatePlantedCropDto extends PartialType(CreatePlantedCropDto) {}
