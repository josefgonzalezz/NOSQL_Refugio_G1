const APIURL = "http://localhost:3000/api/usuarios/";

let modoEdicion = false;
let idEdicion = null;

// Cargar la lista en la tabla
async function cargarDatos() {
    $.ajax({
        type: "GET",
        url: APIURL,
        success: function (responseUsuarios) {
            const tbody = $("#tablaDatos");
            tbody.empty();

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
                            <button class="btn btn-primary btn-editar" data-id="${elementUsuario._id}">
                                Editar
                            </button>
                            <button class="btn btn-danger btn-eliminar" data-id="${elementUsuario._id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar datos: ", error);
            alert("Error al cargar los datos");
        }
    });
}

// Guardar o actualizar usuario
$("#usuarioFormulario").on("submit", function(e) {
    e.preventDefault();

    const datos = {
        nombre: $("#nombre").val(),
        identificacion: $("#identificacion").val(),
        telefono: $("#telefono").val(),
        correo: $("#correo").val(),
        direccion: $("#direccion").val()
    };

    if (modoEdicion) {
        // Actualizar
        $.ajax({
            type: "PUT",
            url: APIURL + idEdicion,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (response) {
                console.log("Usuario actualizado:", response);
                $("#usuarioFormulario")[0].reset();
                cargarDatos();
                cancelarEdicion();
                alert("Usuario actualizado exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error: ", error);
                console.error("Error xhr: ", xhr.responseText);
                alert("Fallo la actualización");
            }
        });
    } else {
        // Crear
        $.ajax({
            type: "POST",
            url: APIURL,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (response) {
                console.log("Usuario creado:", response);
                $("#usuarioFormulario")[0].reset();
                cargarDatos();
                alert("Usuario guardado exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error: ", error);
                console.error("Error xhr: ", xhr.responseText);
                alert("Fallo la inserción");
            }
        });
    }
});

// Evento para editar
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

// Evento para eliminar
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

// Cancelar edición
$("#btnCancelar").on("click", function() {
    cancelarEdicion();
});

function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#usuarioFormulario")[0].reset();
    $("#btnSubmit").text("Guardar");
    $("#btnCancelar").hide();
}

// Cargar datos al iniciar
cargarDatos();
$("#btnCancelar").hide();