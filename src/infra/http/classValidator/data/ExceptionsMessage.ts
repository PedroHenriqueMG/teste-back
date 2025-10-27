export const ExceptionMessage = {
  IsNotEmpty: (property: string) => `O Campo ${property} é obrigatório`,
  IsEmail: (property: string) => `O Campo ${property} deve ser um email`,
  IsString: (property: string) =>
    `O Campo ${property} deve estar no formato string`,
  IsInt: (property: string) => `O Campo ${property} deve ser um número inteiro`,
  IsDate: (property: string) => `O Campo ${property} deve ser uma data válida`,
  MinLength: (min: number, property: string) =>
    `O campo ${property} precisa ter ${min} caracteres`,
  IsEnum: (property: any) => `O campo ${property} não é um enum válido`,
  IsOptional: (property: string) => `O Campo ${property} é opcional`,
};
