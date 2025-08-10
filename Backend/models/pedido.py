from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database.database import Base

class Pedido(Base):
    __tablename__ = 'Pedidos'

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
    fecha_pedido = Column(DateTime, default=datetime.utcnow)

    total_productos = Column(Float, nullable=False)
    descuentos = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    costo_envio = Column(Float, nullable=False)
    total_a_pagar = Column(Float, nullable=False)

    opcion_entrega = Column(String(50), nullable=False)
    ubicacion_seleccionada = Column(String(255), nullable=False)

    metodo_pago = Column(String(50), nullable=False)

    tipo_comprobante = Column(String(50), nullable=False)
    documento_tipo = Column(String(50), nullable=True)
    documento_numero = Column(String(100), nullable=True)
    razon_social = Column(String(255), nullable=True)
    direccion_facturacion = Column(String(255), nullable=True)

    items_pedido_json = Column(Text, nullable=False)

    usuario = relationship("Usuario", back_populates="pedidos")

    def __repr__(self):
        return f"<Pedido(id={self.id}, usuario_id={self.usuario_id}, total_a_pagar={self.total_a_pagar})>"
