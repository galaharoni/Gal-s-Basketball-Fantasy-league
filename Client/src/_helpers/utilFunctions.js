/**
 * currencyFormat: format the number to currency
 * @param {*} value 
 * @returns 
 */
export function currencyFormat(value) {
    if (value)
        return '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return ''
}