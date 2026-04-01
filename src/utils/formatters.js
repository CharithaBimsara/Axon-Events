const lkr = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  currencyDisplay: 'code',
  maximumFractionDigits: 0,
});

const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export const formatCurrency = (value) => lkr.format(value);

export const formatDate = (value) => shortDate.format(new Date(value));
