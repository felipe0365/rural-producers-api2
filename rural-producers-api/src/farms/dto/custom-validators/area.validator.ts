import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { CreateFarmDto } from '../create-farm.dto'

@ValidatorConstraint({ name: 'isAreaValid', async: false })
export class AreaValidator implements ValidatorConstraintInterface {
  validate(args: ValidationArguments) {
    const object = args.object as CreateFarmDto
    const arableArea = Number(object.arableArea) || 0
    const vegetationArea = Number(object.vegetationArea) || 0
    const totalArea = Number(object.totalArea) || 0

    if (arableArea + vegetationArea > totalArea) {
      return false
    }
    return true
  }

  defaultMessage() {
    return 'A soma da área agricultável e de vegetação não pode ser maior que a área total da fazenda.'
  }
}
