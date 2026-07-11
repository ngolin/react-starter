export const formatPercent = (real: number | string, precision = 2, signed = true) => {
  if (typeof real === 'string') {
    return real;
  }
  return `${formatFloat(real * 100, precision, signed)}%`;
};

export const formatFloat = (num: string | number, precision = 2, signed = true) => {
  if (typeof num !== 'number') return num;
  const r1 = num.toPrecision(precision);
  const r2 = num.toFixed(precision);
  const r = r1.length > r2.length ? r1 : r2;
  if (signed && !r.startsWith('-') && /[1-9]/.test(r)) {
    return `+${r}`;
  }
  return r;
};

export const formatNumber = (value: string | number, precision = 2) => {
  const num = Number(value);
  if (num > 1e12) {
    return `${(num / 1e12).toFixed(precision)}万亿`;
  } else if (num > 1e11) {
    return `${(num / 1e11).toFixed(precision)}千亿`;
  } else if (num > 1e8) {
    return `${(num / 1e8).toFixed(precision)}亿`;
  } else if (num > 1e7) {
    return `${(num / 1e7).toFixed(precision)}千万`;
  } else if (num > 1e4) {
    return `${(num / 1e4).toFixed(precision)}万`;
  } else {
    return num.toFixed(precision);
  }
};
