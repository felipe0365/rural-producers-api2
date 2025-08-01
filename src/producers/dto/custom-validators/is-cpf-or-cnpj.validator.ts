import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { cpf, cnpj } from 'cpf-cnpj-validator'

@ValidatorConstraint({ name: 'isCpfOrCnpj', async: false })
export class IsCpfOrCnpj implements ValidatorConstraintInterface {
  validate(document: string) {
    if (!document) return false
    return cpf.isValid(document) || cnpj.isValid(document)
  }

  defaultMessage() {
    return 'Documento inválido. Deve ser um CPF ou CNPJ válido.'
  }
}
