import React from "react";

const TopBar = () => {
  return (
    <div
      className="text-white text-center py-2"
      style={{ backgroundColor: '#A81B8D' }} // ✅ color corregido
    >
      <p className="mb-0">
        ¡Sobrín@ entregamos tu pedido en 30 minutos!
      </p>
    </div>
  );
};

export default TopBar;