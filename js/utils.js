
export function getDist(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
}

export function radiansToDeg(radians){
    return radians * (180 / Math.PI);
}

export function degToRadians(deg){
    return deg / Math.PI * 180;
}

export function quadratic(duration, range, current) {
    return ((duration * 3) / Math.pow(range, 3)) * Math.pow(current, 2);
}

export function randomFloatFromRange(min, max){
    return (Math.random() * (max - min + 1) + min);
}

export function randomFromArray(arr){
    return arr[Math.floor(Math.random() * arr.length)]
}

export function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}
