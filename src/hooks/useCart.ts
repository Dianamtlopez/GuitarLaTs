// Un Costome hook solo debe tener lógica, no debe tener template
// Los hooks son dunciones de js
// Para usar los Hooks, lo primero es importar el hook de useState
import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"
import type { Guitar, CartItem } from "../types"

export const useCart = () =>{
    // Como useEfect se ejecuta almenos una vez, signofica que mi estado va a estar inicializado
    // para solucionar esto vamos a crear una varible con el carrito guardado en storage
    const inicialCart = () : CartItem[] => {
        // Recuperamos lo que tenga localStorage y obtenemos el carrito
        const localStorageCart = localStorage.getItem("cart")
        // Comprobamos si hay algo en la variable, en caso de que no haya nada, va a retornal un null
        // decimos: si localStorageCart tiene algo localStorageCart ? entonces convertimos de string 
        // a un arreglo y en caso de que no haya nada, el valor tiene que ser el arreglo vacío, porque
        // tenemos que setear algo como valor inicial
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    // State
    // Los useState siempre deben definirse en el componente
    const [data] = useState(db)

    // le pasamos la comprobacion de localStorage
    const [cart, setCart] = useState(inicialCart)

    // Creo una constante con cantidad maxima de productos, con eso si necesito 
    // modificarla en algun lado mas, modifico solamente en la constante
    const  MAX_ITEMS = 5
    // Decrementar las guitarra
    const  MIN_ITEMS = 1

    // useEffect
    // Forma recomendada para consimir API
    // Hook, cada que la función cambie, es bastante util para manejar los efectos
    // secundarios de un cambio en nuestro state
    useEffect(() => {
        // Toma dos parametros, el primero es el nombre de lo que se quiere almacenar
        // el segundo es lo que se quiere almacenar, solo permite almacenar strings
        localStorage.setItem('cart', JSON.stringify(cart))
        // en automatico React lo sincronizarlo una vez ese state haya completado su acción 
        // de actualizarse en base a esas fuciones
        // cada que cart cambie quiero ejecutar localStorage
    }, [cart])

    // Agregar productos al carrito
    function addToCart(item : Guitar){
        // findIndex retorna el elemento del array o el indice del elemeto en caso de que lo encuentre,
        // si no lo encuentra devuelve -1
        // revisamos si existe el elemento itemExiste guitar.is === item.id, cart.findIndex esto itera 
        // sobre el carrito e compras, generamos un objeto temporal llamado guitar
        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        // Prevenir que se agreguen más elementos
        if(itemExist >= 0){// Existe en el carrito
        // si existe el item, aumentamos la cantidad de ese item en el carrito
        //console.log('Ya existe, No se agrega el producto...')
        // es en caso de que se oprima varias veces el elemento desde la página
        if(cart[itemExist].quantity >= MAX_ITEMS)return
        // Para no mutar el state, creamos una copua del carrito
        const updatedCart = [...cart]
        // A updatedCart le pasamos la posicion [itemExist] e incrementamos quantity en 1 .quantity ++
        updatedCart[itemExist].quantity++
        // Actualizamos el state
        setCart(updatedCart)
        } else{
        // si no existe el item, lo agregamos al carrito
        console.log('El produco noo existe, Agregando...')
        // Tomamos un tipo de dato y lo convertimos a otro
        const newItem : CartItem = {...item, quantity : 1}
        setCart([...cart, newItem])
        }
        // cuando lleguemos al carrito de compras, ya sea que sea un elemento nuevo o esté actualizando
        // ella a saveLocalStorage para ue me muestre lo que tiene guardado, not tiene nada porque está 
        // tomando los datos del state
        // el state de React es asincrono, lo que significa que el estado no se actualiza inmediatamente 
        // si no hasta unos milisegundos despues por lo tanto no funcioa correctamente
    }

    // Burrar productos del carrito
    function removeFromCart(id: Guitar['id']){
        // Eliminamos el item del carrito
        // Si la funcion usa un parametro, donde se hace el llamado kay que poner un callback
        // Lo que hace es traerme las dos guitarras diferentes a la que quiero eliminar y eso
        // regresa el nuevo arreglo y llo setea en la funcion
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))

    }
    // boton - para quitar mas productos
    // toma un id porque igual que en eliminar requerimos identificar el elemento
    function decreaseQuantity(id: Guitar['id']) {
        // Buscamos el item en el carrito, usamos map que nos retorna un arreglo nuevo
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    // mantengo las propiedades
                    ...item,
                    // modifico la cantidad
                    quantity: item.quantity - 1
                }
            }
            // para que mantenga el resto de lelementos sobre los cuales no incrementé las cantidades
            return item
        })
        // ya está la variable modificada pero tengo que setear el carrito
        setCart(updatedCart)
    }
    
    function increaseQuantity(id: Guitar['id']) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS ){
                return {
                    ...item,
                    quantity: item.quantity + 1 
                }
            }
            return item
        })
        setCart(updatedCart)
    }


    // Vaciar el Carrito
    function clearCart(){
        setCart([])
    }

    // State derivado
    // useMemo, evita que el código se ejecute si las dependencias no han cambiado
    // Toma dos parámetros uno es la funcion y el segundo el arreglo de dependencias
    //  [cart] lo que significa que no haga nada hasta que el carrito cambie
    // En ese caso isEmpty ya no es una funcion
    const isEmpty = useMemo( () => cart.length === 0, [cart] )

    // array method
    // el primer parametro es el total que va acumulando valor producto de operar 
    // (item.quantity * item.price) a medida que itera
    // el segundo valor es el item, es decir el elemento actual
    // el cero es el valor inicial y vamos a sumar a partir de ahi
    const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    // El return es un arreglo pero se recomienda colocarlo como un objeto
    return {
       data, 
       cart,
       addToCart,
       removeFromCart,
       decreaseQuantity,
       increaseQuantity,
       clearCart,
       isEmpty,
       cartTotal
    }
}

