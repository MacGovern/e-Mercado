document.addEventListener('DOMContentLoaded', ()=> {
    const loginF = document.getElementById('login');
    const usuarioIng = document.getElementById('usuario');
    const contraseñaIng = document.getElementById('contraseña');
    
    loginF.addEventListener('submit', ()=> {
        event.preventDefault();

        const usuario = usuarioIng.value;
        const contraseña = contraseñaIng.value;

        if (usuario !== '' && contraseña !== '') {
            window.location.href = 'index.html'; 
        } else {
            alert('Ingresa datos válidos');
        }
    });
});
