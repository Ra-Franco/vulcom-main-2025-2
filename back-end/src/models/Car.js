import { z } from "zod";

// Ano corrente para validação do year_manufacture
const currentYear = new Date().getFullYear();

// Data de abertura da loja: 20/03/2020
const storeOpeningDate = new Date("2020-03-20");
storeOpeningDate.setHours(0, 0, 0, 0); // Zera horas, minutos, segundos e milissegundos

// Data atual (hoje) para validação de selling_date
const today = new Date();
today.setHours(23, 59, 59, 999); // Define para o final do dia de hoje

// Cores permitidas
const allowedColors = [
  "AMARELO",
  "AZUL",
  "BRANCO",
  "CINZA",
  "DOURADO",
  "LARANJA",
  "MARROM",
  "PRATA",
  "PRETO",
  "ROSA",
  "ROXO",
  "VERDE",
  "VERMELHO",
];

const Car = z.object({
  brand: z
    .string()
    .trim()
    .min(1, { message: "A marca deve ter, no mínimo, 1 caractere." })
    .max(25, { message: "A marca deve ter, no máximo, 25 caracteres." }),

  model: z
    .string()
    .trim()
    .min(1, { message: "O modelo deve ter, no mínimo, 1 caractere." })
    .max(25, { message: "O modelo deve ter, no máximo, 25 caracteres." }),

  color: z.enum(allowedColors, {
    message: "Cor inválida. Escolha uma das cores permitidas.",
  }),

  year_manufacture: z
    .number()
    .int({ message: "O ano de fabricação deve ser um número inteiro." })
    .min(1960, {
      message: "O ano de fabricação deve ser, no mínimo, 1960.",
    })
    .max(currentYear, {
      message: `O ano de fabricação não pode ser posterior a ${currentYear}.`,
    }),

  imported: z.boolean({
    message: "O campo 'importado' deve ser verdadeiro ou falso.",
  }),

  plates: z
    .string()
    // Remove máscara (espaços, hífens) antes de validar
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine((val) => val.length === 8, {
      message: "A placa deve ter exatamente 8 caracteres.",
    }),

  selling_date: z
    .union([
      z.coerce.date({
        message: "A data de venda deve ser uma data válida.",
      }).min(storeOpeningDate, {
        message: "A data de venda não pode ser anterior à abertura da loja (20/03/2020).",
      }).max(today, {
        message: "A data de venda não pode ser posterior à data de hoje.",
      }),
      z.null(),
      z.undefined()
    ])
    .optional(), // Campo opcional

  selling_price: z
    .union([
      z.number({
        message: "O preço de venda deve ser um número.",
      }).min(5000.0, {
        message: "O preço de venda deve ser, no mínimo, R$ 5.000,00.",
      }).max(5000000.0, {
        message: "O preço de venda deve ser, no máximo, R$ 5.000.000,00.",
      }),
      z.null(),
      z.undefined()
    ])
    .optional(), // Campo opcional
});

export default Car;

