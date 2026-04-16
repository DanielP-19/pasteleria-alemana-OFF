const usuarios = [
    { email: "inventario@alemana.com", password: "1234", rol: "inventario" },
    { email: "ventas@alemana.com", password: "1234", rol: "ventas" },
    { email: "gerente@alemana.com", password: "1234", rol: "gerente" }
];

document.addEventListener("DOMContentLoaded", function(){

    const form = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");

    form.addEventListener("submit", function(e){
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if(email === "" || password === ""){
            errorMsg.textContent = "Por favor complete todos los campos";
            errorMsg.style.display = "block";
            errorMsg.className = "error-message error";
            return;
        }

        const usuario = usuarios.find(u => 
            u.email === email && u.password === password
        );

        if(usuario){
            errorMsg.textContent = "¡Inicio de sesión exitoso! Redirigiendo...";
            errorMsg.style.display = "block";
            errorMsg.className = "error-message success";
            
            sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            errorMsg.textContent = "Correo o contraseña incorrectos";
            errorMsg.style.display = "block";
            errorMsg.className = "error-message error";
            
            document.getElementById("password").value = "";
        }
    });

});