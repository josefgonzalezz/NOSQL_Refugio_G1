const APIURL = "http://localhost:3000/api/usuarios/";

let modoEdicion = false;
let idEdicion = null;

function cargarDatos() {
    $.ajax({
        type: "GET",
        url: APIURL,
        success: function (responseUsuarios) {
            const tbody = $("#tablaDatos");
            tbody.empty();

            if (responseUsuarios && responseUsuarios.length > 0) {
                responseUsuarios.forEach(elementUsuario => {
                    tbody.append(`
                        <tr>
                            <td>${elementUsuario._id}</td>
                            <td>${elementUsuario.nombre}</td>
                            <td>${elementUsuario.identificacion}</td>
                            <td>${elementUsuario.telefono}</td>
                            <td>${elementUsuario.correo}</td>
                            <td>${elementUsuario.direccion}</td>
                            <td>
                                <button class="btn btn-warning btn-sm btn-editar" data-id="${elementUsuario._id}">
                                    Editar
                                </button>
                                <button class="btn btn-danger btn-sm btn-eliminar" data-id="${elementUsuario._id}">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `);
                });
            } else {
                tbody.append('<tr><td colspan="7" class="uk-text-center">No hay usuarios registrados.</td></tr>');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar datos: ", error);
            alert("Error al cargar los datos");
        }
    });
}

function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#usuarioFormulario")[0].reset();
    $("#btnSubmit").text("Guardar");
    $("#btnCancelar").hide();
}

$(document).ready(function() {
    
    $("#usuarioFormulario").on("submit", function(e) {
        e.preventDefault();

        const datos = {
            nombre: $("#nombre").val(),
            identificacion: $("#identificacion").val(),
            telefono: $("#telefono").val(),
            correo: $("#correo").val(),
            direccion: $("#direccion").val()
        };

        const tipoPeticion = modoEdicion ? "PUT" : "POST";
        const urlPeticion = modoEdicion ? APIURL + idEdicion : APIURL;
        const mensajeExito = modoEdicion ? "actualizado" : "guardado";
        const mensajeFallo = modoEdicion ? "actualización" : "inserción";

        $.ajax({
            type: tipoPeticion,
            url: urlPeticion,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (response) {
                console.log(`Usuario ${mensajeExito}:`, response);
                cargarDatos();
                cancelarEdicion(); 
                alert(`Usuario ${mensajeExito} exitosamente`);
                $('#modalId').modal('hide'); 
            },
            error: function(xhr, status, error) {
                console.error("Error: ", error);
                console.error("Error xhr: ", xhr.responseText);
                alert(`Fallo la ${mensajeFallo}`);
            }
        });
    });

    $(document).on("click", ".btn-editar", function() {
        const id = $(this).data("id");
        
        $.ajax({
            type: "GET",
            url: APIURL + id,
            success: function (usuario) {
                $("#nombre").val(usuario.nombre);
                $("#identificacion").val(usuario.identificacion);
                $("#telefono").val(usuario.telefono);
                $("#correo").val(usuario.correo);
                $("#direccion").val(usuario.direccion);
                
                modoEdicion = true;
                idEdicion = id;
                
                $("#btnSubmit").text("Actualizar");
                $("#btnCancelar").show();
                
                $('#modalId').modal('show');
                
                $('html, body').animate({
                    scrollTop: $("#usuarioFormulario").offset().top
                }, 500);
            },
            error: function(xhr, status, error) {
                console.error("Error al cargar usuario: ", error);
                alert("Error al cargar el usuario para editar");
            }
        });
    });

    $(document).on("click", ".btn-eliminar", function() {
        const id = $(this).data("id");
        
        if (confirm("¿Está seguro que desea eliminar este usuario?")) {
            $.ajax({
                type: "DELETE",
                url: APIURL + id,
                success: function (response) {
                    console.log("Usuario eliminado:", response);
                    cargarDatos();
                    alert("Usuario eliminado exitosamente");
                },
                error: function(xhr, status, error) {
                    console.error("Error: ", error);
                    console.error("Error xhr: ", xhr.responseText);
                    alert("Error al eliminar el usuario");
                }
            });
        }
    });

    $("#btnCancelar").on("click", function() {
        cancelarEdicion();
        $('#modalId').modal('hide');
    });
    cargarDatos(); 
    $("#btnCancelar").hide(); 
});