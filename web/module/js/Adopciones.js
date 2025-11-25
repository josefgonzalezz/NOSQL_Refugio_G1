const APIURL = "http://localhost:3000/api/adopcion/"; 

let modoEdicion = false;
let idEdicion = null;

async function cargarDatos() {
    $.ajax({
        type: "GET",
        url: APIURL,
        success: function (responseAdopciones) {
            const tbody = $("#tablaDatos");
            tbody.empty();

            responseAdopciones.forEach(adopcion => {
                const idAnimal = adopcion.idAnimal?._id || adopcion.idAnimal;
                const idCliente = adopcion.idCliente?._id || adopcion.idCliente;

                tbody.append(`
                    <tr>
                        <td>${adopcion._id}</td>
                        <td>${idAnimal}</td>
                        <td>${idCliente}</td>
                        <td>${adopcion.fechaAdopcion}</td>
                        <td>${adopcion.estado}</td>
                        <td>${adopcion.observaciones || ''}</td>
                        <td>
                            <button class="btn btn-primary btn-editar" data-id="${adopcion._id}" data-bs-toggle="modal" data-bs-target="#modalAdopcion">
                                Editar
                            </button>
                            <button class="btn btn-danger btn-eliminar" data-id="${adopcion._id}">
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
        $.ajax({
            type: "PUT",
            url: APIURL + idEdicion,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (response) {
                $("#adopcionFormulario")[0].reset();
                cargarDatos();
                cancelarEdicion();
                $("#modalAdopcion").modal('hide'); 
                alert("Adopción actualizada exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error al actualizar: ", error);
                alert("Fallo la actualización de la adopción");
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: APIURL,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (response) {
                $("#adopcionFormulario")[0].reset();
                cargarDatos();
                $("#modalAdopcion").modal('hide'); 
                alert("Adopción guardada exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error al crear: ", error);
                alert("Fallo la inserción de la adopción");
            }
        });
    }
});


$(document).on("click", ".btn-editar", function() {
    const id = $(this).data("id");

    $.ajax({
        type: "GET",
        url: APIURL + id,
        success: function (adopcion) {
            $("#idAnimal").val(adopcion.idAnimal?._id || adopcion.idAnimal);
            $("#idCliente").val(adopcion.idCliente?._id || adopcion.idCliente);
            $("#fechaAdopcion").val(adopcion.fechaAdopcion);
            $("#estado").val(adopcion.estado);
            $("#observaciones").val(adopcion.observaciones);
            
            modoEdicion = true;
            idEdicion = id;
            
            $("#btnSubmit").text("Actualizar");
            $("#btnCancelar").show();
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar adopción: ", error);
            alert("Error al cargar la adopción para editar");
        }
    });
});


$(document).on("click", ".btn-eliminar", function() {
    const id = $(this).data("id");
    
    if (confirm("¿Está seguro que desea eliminar este registro de adopción?")) {
        $.ajax({
            type: "DELETE",
            url: APIURL + id,
            success: function (response) {
                cargarDatos();
                alert("Adopción eliminada exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error al eliminar: ", error);
                alert("Error al eliminar la adopción");
            }
        });
    }
});


$("#btnCancelar").on("click", function() {
    cancelarEdicion();
    $("#modalAdopcion").modal('hide'); 
});

function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#adopcionFormulario")[0].reset();
    $("#btnSubmit").text("Guardar");
    $("#btnCancelar").hide();
}


$('#modalAdopcion').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    const id = button.data('id');

    if (!id) {
        cancelarEdicion();
    }
});


cargarDatos();
$("#btnCancelar").hide();
