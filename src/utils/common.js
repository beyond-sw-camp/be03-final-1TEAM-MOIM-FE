export function matrixToDescription(matrix) {
    switch (matrix) {
        case 'Q1':
            return '중요 & 긴급하지 않음';
        case 'Q2':
            return '중요 & 긴급';
        case 'Q3':
            return '긴급 & 중요하지 않음';
        case 'Q4':
            return '긴급하지 않음 & 중요하지 않음';
        default:
            return '';
    }
}