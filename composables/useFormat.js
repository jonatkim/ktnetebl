export const useFormat = () => {
  const formatNumber = (num) => {
    if (num === null || num === undefined) return ''
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const formatCurrency = (num, currency = '₩') => {
    return `${currency} ${formatNumber(num)}`
  }

  return {
    formatNumber,
    formatCurrency,
  }
}
