export const SEO_RULES = {
  title: { min: 20, max: 50, label: 'Title' },
  description: { min: 120, max: 160, label: 'Description' },
};

/**
 * Evaluates character length against SEO optimal bounds.
 * Returns status ('empty' | 'short' | 'optimal' | 'long'), color, percent, and message.
 */
export function evaluateSeoLength(value = '', field = 'title') {
  const { min, max, label } = SEO_RULES[field];
  const len = value.trim().length;

  if (len === 0) {
    return {
      length: 0,
      status: 'empty',
      color: 'grey',
      percent: 0,
      isValid: false,
      message: `${label} is required (optimal: ${min}–${max} characters).`,
    };
  }

  const percent = Math.min(100, Math.round((len / max) * 100));

  if (len < min) {
    return {
      length: len,
      status: 'short',
      color: 'yellow',
      percent,
      isValid: true,
      message: `${len}/${max} chars — Too short for optimal SEO (aim for ${min}–${max}).`,
    };
  }

  if (len > max) {
    return {
      length: len,
      status: 'long',
      color: 'orange',
      percent: 100,
      isValid: true,
      message: `${len}/${max} chars — Exceeds optimal SEO length (may truncate in search results).`,
    };
  }

  return {
    length: len,
    status: 'optimal',
    color: 'green',
    percent,
    isValid: true,
    message: `${len}/${max} chars — Optimal SEO length.`,
  };
}
