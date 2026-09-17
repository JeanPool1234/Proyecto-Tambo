const TopBar = () => (
  <div 
    className="text-white text-center py-2"
    // Usamos el color oficial. Si usas esto en muchos lados, muévelo a un archivo CSS global.
    style={{ backgroundColor: '#A81B8D' }} 
  >
    {/* OPTIMIZACIÓN RESPONSIVA: 
       En 320px el texto se partirá en dos líneas. 
       Agregamos 'small' o 'fs-6' para que no ocupe tanto espacio vertical en móviles.
       'fw-bold' para que resalte más.
    */}
    <p className="mb-0 fw-bold small px-2">
      ¡Sobrín@ entregamos tu pedido en 30 minutos!
    </p>
  </div>
);

export default TopBar;