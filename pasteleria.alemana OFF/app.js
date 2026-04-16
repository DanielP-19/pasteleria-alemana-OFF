const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

if(!usuario){
    window.location.href = "index.html";
}

const menu = document.getElementById("menu");

menu.innerHTML = `
<li><a href="inventario.html">Inventario</a></li>
`;

const productos = JSON.parse(localStorage.getItem("productos")) || [];
document.getElementById("totalProductos").textContent = productos.length;

function cerrarSesion(){
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}