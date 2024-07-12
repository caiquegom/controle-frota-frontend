export function formatPhoneNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

export function clearNumberFormat(value: string) {
  return value.replace(/\D/g, '');
}

export function formatToReal(value: number) {
  const Real = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return Real.format(value);
}
