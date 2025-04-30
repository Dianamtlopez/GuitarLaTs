// cuando se crea types.d.ts, en el mismo directorio src .d. nos indica que es un archivo con 
// definiciones lo que nos indica que no neecitamos importarlo, pero con la nueva convension 
// no recomiendan hacerlo asi

// En este caso vamos a usar interface, o sea hacer una interface para definir el tipo de datos
// interface Guitar = {
//     id: number
//     name: string
//     image: string
//     description: string
//     price: number
// }

// En este caso vamos a usar type, o sea tipar los datos
export type Guitar = {
    id: number
    name: string
    image: string
    description: string
    price: number
}

// Heredar propiedades de Guitar
export type CartItem = Guitar & {
    quantity: number
}
