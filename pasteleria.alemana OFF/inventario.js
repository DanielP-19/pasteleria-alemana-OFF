let productos = JSON.parse(localStorage.getItem("productos")) || [];
let productoEditando = null;

function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

function toggleFiltrosAvanzados() {
    const panel = document.getElementById('filtrosAvanzados');
    const toggle = document.getElementById('filtroToggle');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        panel.style.display = 'none';
        toggle.textContent = '▶';
    }
}

function aplicarFiltrosAvanzados() {
    const lista = document.getElementById("listaProductos");
    if (!lista) return;

    const filtroNombre = document.getElementById('buscadorProducto')?.value.toLowerCase().trim() || '';
    const filtroCategoria = document.getElementById('filtroCategoria')?.value || '';
    const filtroPresentacion = document.getElementById('filtroPresentacion')?.value || '';
    const filtroTamano = document.getElementById('filtroTamano')?.value || '';
    const filtroRelleno = document.getElementById('filtroRelleno')?.value || '';
    const filtroCobertura = document.getElementById('filtroCobertura')?.value || '';
    const filtroEstado = document.getElementById('filtroEstado')?.value || '';
    const filtroStockMin = document.getElementById('filtroStockMin')?.value;
    const filtroPrecioMax = document.getElementById('filtroPrecioMax')?.value;

    console.log("Filtro Estado seleccionado:", filtroEstado);

    const productosFiltrados = productos.filter(p => {
        if (filtroNombre && !p.nombre.toLowerCase().includes(filtroNombre)) return false;
        if (filtroCategoria && p.categoria !== filtroCategoria) return false;
        if (filtroPresentacion && p.presentacion !== filtroPresentacion) return false;
        if (filtroTamano && p.tamano !== filtroTamano) return false;
        if (filtroRelleno && p.relleno !== filtroRelleno) return false;
        if (filtroCobertura && p.cobertura !== filtroCobertura) return false;
        if (filtroEstado) {
            if (p.estado !== filtroEstado) return false;
        }
        if (filtroStockMin && filtroStockMin !== '' && !isNaN(filtroStockMin)) {
            if (p.cantidad < parseInt(filtroStockMin)) return false;
        }
        if (filtroPrecioMax && filtroPrecioMax !== '' && !isNaN(filtroPrecioMax)) {
            if (p.precio > parseFloat(filtroPrecioMax)) return false;
        }
        return true;
    });

    console.log("Productos encontrados:", productosFiltrados.length);

    const resultadosCount = document.getElementById('resultadosCount');
    if (resultadosCount) {
        resultadosCount.textContent = productosFiltrados.length;
    }

    mostrarProductosFiltrados(productosFiltrados);
}

function limpiarFiltrosAvanzados() {
    document.getElementById('buscadorProducto').value = '';
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroPresentacion').value = '';
    document.getElementById('filtroTamano').value = '';
    document.getElementById('filtroRelleno').value = '';
    document.getElementById('filtroCobertura').value = '';
    document.getElementById('filtroEstado').value = '';
    document.getElementById('filtroStockMin').value = '';
    document.getElementById('filtroPrecioMax').value = '';
    
    aplicarFiltrosAvanzados();
}

function mostrarProductosFiltrados(productosFiltrados) {
    const lista = document.getElementById("listaProductos");
    lista.innerHTML = "";

    if (productosFiltrados.length === 0) {
        lista.innerHTML = `
        <div class="lista-card">
            <div class="lista-info">
                <span>No hay productos que coincidan con los filtros.</span>
            </div>
        </div>`;
        return;
    }

    productosFiltrados.forEach(p => {
        const indiceOriginal = productos.indexOf(p);
        const alertaStock = p.cantidad <= 10
            ? '<span style="color:red;font-weight:bold;"> ⚠ Bajo stock</span>'
            : "";
        const borde = p.cantidad <= 10 ? "border-left:6px solid red;" : "";

        lista.innerHTML += `
        <div class="lista-card" style="${borde}">
            <div class="producto-header">
                <div class="lista-info">
                    <span><b>Producto:</b> ${p.nombre}</span>
                    <span><b>Categoría:</b> ${p.categoria}</span>
                    <span><b>Presentación:</b> ${p.presentacion}</span>
                    <span><b>Tamaño:</b> ${p.tamano}</span>
                    <span><b>Relleno:</b> ${p.relleno}</span>
                    <span><b>Cobertura:</b> ${p.cobertura}</span>
                    <span><b>Estado:</b> ${p.estado}</span>
                    <span><b>Cantidad:</b> ${p.cantidad} ${alertaStock}</span>
                    <span><b>Precio:</b> $${p.precio}</span>
                    <span><b>Observaciones:</b> ${p.observaciones || "Sin observaciones"}</span>
                </div>
            </div>
            <div class="lista-botones">
                <button class="btn-warning" onclick="editarProducto(${indiceOriginal})">Editar</button>
                <button class="btn-danger" onclick="eliminarProducto(${indiceOriginal})">Eliminar</button>
            </div>
        </div>`;
    });
}

function mostrarInventario() {
    aplicarFiltrosAvanzados();
}

function buscarProducto() {
    aplicarFiltrosAvanzados();
}

function agregarProducto() {
    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const presentacion = document.getElementById("presentacion").value.trim();
    const tamano = document.getElementById("tamano").value.trim();
    const relleno = document.getElementById("relleno").value.trim();
    const cobertura = document.getElementById("cobertura").value.trim();
    const estado = document.getElementById("estado").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const precio = parseFloat(document.getElementById("precio").value);
    const observaciones = document.getElementById("observaciones").value.trim();

    if (!nombre || !categoria || !presentacion || !tamano || !relleno || !cobertura || !estado || cantidad <= 0 || precio <= 0) {
        alert("Complete todos los campos correctamente");
        return;
    }

    productos.push({
        nombre, categoria, presentacion, tamano, relleno, cobertura,
        estado, cantidad, precio, observaciones
    });

    guardarProductos();
    mostrarInventario();

    document.querySelectorAll("#inventario input, #inventario textarea").forEach(e => e.value = "");
}

function eliminarProducto(i) {
    productos.splice(i, 1);
    guardarProductos();
    mostrarInventario();
}

function editarProducto(i) {
    productoEditando = i;
    const p = productos[i];

    document.getElementById("editNombre").value = p.nombre;
    document.getElementById("editCategoria").value = p.categoria;
    document.getElementById("editPresentacion").value = p.presentacion;
    document.getElementById("editTamano").value = p.tamano;
    document.getElementById("editRelleno").value = p.relleno;
    document.getElementById("editCobertura").value = p.cobertura;
    document.getElementById("editEstado").value = p.estado;
    document.getElementById("editCantidad").value = p.cantidad;
    document.getElementById("editPrecio").value = p.precio;
    document.getElementById("editObservaciones").value = p.observaciones;

    document.getElementById("modalEditarProducto").style.display = "flex";
}

function guardarEdicionProducto() {
    if (productoEditando === null) return;
    document.getElementById("modalConfirmacion").style.display = "flex";
}

function confirmarGuardar() {
    productos[productoEditando].nombre = document.getElementById("editNombre").value;
    productos[productoEditando].categoria = document.getElementById("editCategoria").value;
    productos[productoEditando].presentacion = document.getElementById("editPresentacion").value;
    productos[productoEditando].tamano = document.getElementById("editTamano").value;
    productos[productoEditando].relleno = document.getElementById("editRelleno").value;
    productos[productoEditando].cobertura = document.getElementById("editCobertura").value;
    productos[productoEditando].estado = document.getElementById("editEstado").value;
    productos[productoEditando].cantidad = parseInt(document.getElementById("editCantidad").value);
    productos[productoEditando].precio = parseFloat(document.getElementById("editPrecio").value);
    productos[productoEditando].observaciones = document.getElementById("editObservaciones").value;

    guardarProductos();
    mostrarInventario();

    cerrarConfirmacion();
    cerrarModalEditar();
}

function cerrarModalEditar() {
    document.getElementById("modalEditarProducto").style.display = "none";
}

function cerrarConfirmacion() {
    document.getElementById("modalConfirmacion").style.display = "none";
}

mostrarInventario();