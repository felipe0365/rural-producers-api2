import { PartialType } from '@nestjs/mapped-types';
import { CreatePlantedCropDto } from './create-planted-crop.dto';

export class UpdatePlantedCropDto extends PartialType(CreatePlantedCropDto) {}
