
// Importación de librerías
import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { useCart } from "./hooks/useCart"

// Los componentes siemppre deben iniciar en mayusculas
function App() {
  
  // Sacamos el valor del archivo y lo usamos en nuestro componente
  const { data, cart, addToCart, removeFromCart, decreaseQuantity, increaseQuantity, clearCart, 
    isEmpty, cartTotal } = useCart()

  return (
    <>
      {/* Renderizar */}
      <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        clearCart={clearCart}
        isEmpty={isEmpty}
        cartTotal={cartTotal}
      />
      <main className="container-xl mt-5">
          <h2 className="text-center">Nuestra Colección</h2>

          <div className="row mt-5">
            {/* Renderizar 
                Cuando solo vamos a retornar algo, podemos utilizar el return implicito
                Significa que quitamos llaves, colocamos parentesis y lo que deseamos retornar
                el map, itera sobre db y por cada elemento, genera una guitarra
                siempre que trabajo con map, debo colocar un key que sea un valor unico, 
                si trabajo con base de datos y tengo id, coloco el id*/}
            {data.map((guitar) => (
                <Guitar 
                  key = {guitar.id}
                  guitar={guitar}
                  addToCart={addToCart}
                /> 
              )
            )}
   
          </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
          <div className="container-xl">
              <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
          </div>
      </footer>
    </>
  )
}

export default App
