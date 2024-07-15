export function generateSerie(length = 4, parts = 3, prefix = '') {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const partsArray = [];

    for (let i = 0; i < parts; i++) {
        let part = '';

        for (let j = 0; j < length; j++) {
            part += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        partsArray.push(part);
    }

    const series = partsArray.join('-');
    return prefix ? `${prefix}:${series}` : series;
}