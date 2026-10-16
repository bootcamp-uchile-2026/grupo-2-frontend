import { z } from 'zod';

function validRut(value: string) {

  const rut = value.replace(/[.\s-]/g, '').toUpperCase();

  if (!/^\d{7,8}[\dK]$/.test(rut)) return false;

  let sum = 0;
  let multiplier = 2;

  for (const digit of rut.slice(0, -1).split('').reverse()) {
    sum += Number(digit) * multiplier;

    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const check =
    remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);

  return rut.at(-1) === check;
}

export const shippingSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(3, 'El nombre debe tener al menos 3 letras.'),
    lastName: z.string().trim().min(1, 'Ingresa tu apellido.'),
    email: z.string().trim().email('Ingresa un correo electrónico válido.'),
    rut: z
      .string()
      .trim()
      .refine(validRut, 'Ingresa un RUT válido, con dígito verificador.'),
    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+?56[\s-]?)?[2-9](?:[\s-]?\d){8}$/,
        'Ingresa un teléfono chileno de 9 dígitos, con +56 opcional.',
      ),
    commune: z.string().trim().min(1, 'Selecciona una comuna.'),
    street: z.string().trim().min(1, 'Ingresa la calle.'),
    number: z.string().trim(),
    noNumber: z.boolean(),
    unit: z.string().trim(),
    postalCode: z
      .string()
      .trim()
      .regex(/^(?:\d{7})?$/, 'El código postal debe tener 7 dígitos.'),
    instructions: z.string().trim(),
  })
  .superRefine((data, context) => {

    if (!data.noNumber && !/^\d+[a-zA-Z]?$/.test(data.number)) {
      context.addIssue({
        code: 'custom',
        path: ['number'],
        message: 'Ingresa un número de calle válido o marca Calle sin número.',
      });
    }
  });

export type ShippingData = z.infer<typeof shippingSchema>;
