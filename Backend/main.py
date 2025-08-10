from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from controllers.productos import router as productos
from controllers.producto_buscar import router as producto_buscar_router
from controllers.distritosBD import router as distritosBD_router
from controllers.auth import router as auth_router
from controllers.carrito_controller import router as carrito_router
from controllers.pedido import router as pedido
from controllers.distrito import router as distrito_router
from controllers.productos1 import router as productos_router
from controllers.categoria import router as categorias_router
from controllers.buscarProdxCat import router as buscarProdxCat
from controllers.pedidos_service import router as pedidos_router

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Incluir rutas
app.include_router(productos, prefix="/api/productosLista")
app.include_router(producto_buscar_router)
app.include_router(distritosBD_router, prefix="/api/distritosLista")
app.include_router(auth_router, prefix="/api/auth", tags=["Login"])
app.include_router(carrito_router, prefix="/api/carrito", tags=["Carrito"])
app.include_router(pedido, prefix="/api/pedido", tags=["Pedido"])
app.include_router(distrito_router, prefix="/api/buscarDistrito")
app.include_router(productos_router)
app.include_router(categorias_router, prefix="/api/categorias", tags=["Categorías"])
app.include_router(buscarProdxCat, prefix="/api/categorias", tags=["Categorías"])
app.include_router(pedidos_router)
