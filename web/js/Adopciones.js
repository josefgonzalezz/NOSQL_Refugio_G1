const APIURL = "http://localhost:3000/api/adopcion/"; 

let modoEdicion = false;
let idEdicion = null;

// Cargar la lista de adopciones en la tabla
async function cargarDatos() {
    $.ajax({
        type: "GET",
        url: APIURL,
        success: function (responseAdopciones) {
            const tbody = $("#tablaDatos");
            tbody.empty();

            responseAdopciones.forEach(elementAdopcion => {
                tbody.append(`
                    <tr>
                        <td>${elementAdopcion._id}</td>
                        <td>${elementAdopcion.idAnimal}</td>
                        <td>${elementAdopcion.idCliente}</td>
                        <td>${elementAdopcion.fechaAdopcion}</td>
                        <td>${elementAdopcion.estado}</td>
                        <td>${elementAdopcion.observaciones || ''}</td>
                        <td>
                            <button class="btn btn-primary btn-editar" data-id="${elementAdopcion._id}" data-bs-toggle="modal" data-bs-target="#modalAdopcion">
                                Editar
                            </button>
                            <button class="btn btn-danger btn-eliminar" data-id="${elementAdopcion._id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar datos: ", error);
            alert("Error al cargar las adopciones");
        }
    });
}

// Guardar o actualizar adopción
$("#adopcionFormulario").on("submit", function(e) {
    e.preventDefault();

    const datos = {
        idAnimal: $("#idAnimal").val(),
        idCliente: $("#idCliente").val(),
        fechaAdopcion: $("#fechaAdopcion").val(),
        estado: $("#estado").val(),
        observaciones: $("#observaciones").val()
    };

    if (modoEdicion) {
        // Actualizar
        $.ajax({
            type: "PUT",
            url: APIURL + idEdicion,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (response) {
                console.log("Adopción actualizada:", response);
                $("#adopcionFormulario")[0].reset();
                cargarDatos();
                cancelarEdicion();
                // Cerrar modal después de actualizar
                $("#modalAdopcion").modal('hide'); 
                alert("Adopción actualizada exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error: ", error);
                console.error("Error xhr: ", xhr.responseText);
                alert("Fallo la actualización de la adopción");
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
                console.log("Adopción creada:", response);
                $("#adopcionFormulario")[0].reset();
                cargarDatos();
                // Cerrar modal después de crear
                $("#modalAdopcion").modal('hide'); 
                alert("Adopción guardada exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error: ", error);
                console.error("Error xhr: ", xhr.responseText);
                alert("Fallo la inserción de la adopción");
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
        success: function (adopcion) {
            // Llenar el formulario con los datos de la adopción
            $("#idAnimal").val(adopcion.idAnimal);
            $("#idCliente").val(adopcion.idCliente);
            $("#fechaAdopcion").val(adopcion.fechaAdopcion);
            $("#estado").val(adopcion.estado);
            $("#observaciones").val(adopcion.observaciones);
            
            modoEdicion = true;
            idEdicion = id;
            
            $("#btnSubmit").text("Actualizar");
            $("#btnCancelar").show();
            
            // Abrir el modal para edición (ya está manejado por el data-bs-target en el HTML)
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar adopción: ", error);
            alert("Error al cargar la adopción para editar");
        }
    });
});

// Evento para eliminar
$(document).on("click", ".btn-eliminar", function() {
    const id = $(this).data("id");
    
    if (confirm("¿Está seguro que desea eliminar este registro de adopción?")) {
        $.ajax({
            type: "DELETE",
            url: APIURL + id,
            success: function (response) {
                console.log("Adopción eliminada:", response);
                cargarDatos();
                alert("Adopción eliminada exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error: ", error);
                console.error("Error xhr: ", xhr.responseText);
                alert("Error al eliminar la adopción");
            }
        });
    }
});

// Cancelar edición
$("#btnCancelar").on("click", function() {
    cancelarEdicion();
    // Opcional: Cerrar el modal al cancelar
    $("#modalAdopcion").modal('hide'); 
});

// Resetear formulario y modo de edición
function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#adopcionFormulario")[0].reset();
    $("#btnSubmit").text("Guardar");
    $("#btnCancelar").hide();
}

// Asegurarse de limpiar el formulario al abrir el modal para "Agregar"
$('#modalAdopcion').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Botón que disparó el modal
    var id = button.data('id')

    // Si no tiene data-id (es el botón "Registrar Adopción"), es modo creación
    if (!id) {
        cancelarEdicion();
    }
})

// Cargar datos al iniciar
cargarDatos();
$("#btnCancelar").hide();