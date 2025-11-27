const APIURL = "http://localhost:3000/api/donacion/";
const APIURL_REFUGIOS = "http://localhost:3000/api/refugios/";
const APIURL_CLIENTES = "http://localhost:3000/api/usuarios/";

let modoEdicion = false;
let idEdicion = null;

async function cargarDatos() {
    $.ajax({
        type: "GET",
        url: APIURL,
        success: function (donaciones) {
            const tbody = $("#tablaDatos");
            tbody.empty();

            donaciones.forEach(donacion => {
                const idRefugio = donacion.idRefugio?._id || donacion.idRefugio;
                const idCliente = donacion.idCliente?._id || donacion.idCliente;

                tbody.append(`
                    <tr>
                        <td>${donacion._id}</td>
                        <td>${idRefugio}</td>
                        <td>${idCliente}</td>
                        <td>${donacion.montoCantidad}</td>
                        <td>${donacion.fecha}</td>
                        <td>${donacion.descripcion}</td>
                        <td>
                            <button class="btn btn-primary btn-editar" data-id="${donacion._id}" data-bs-toggle="modal" data-bs-target="#modalDonacion">
                                Editar
                            </button>
                            <button class="btn btn-danger btn-eliminar" data-id="${donacion._id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar donaciones: ", error);
            alert("Error al cargar las donaciones");
        }
    });
}


async function cargarSelects() {
    const selectRefugio = $("#idRefugio");
    const selectCliente = $("#idCliente");


    selectRefugio.empty();
    selectCliente.empty();

    try {
        const refugios = await $.ajax({ type: "GET", url: APIURL_REFUGIOS });
        refugios.forEach(r => {
            selectRefugio.append(`<option value="${r._id}">${r.nombre || r._id}</option>`);
        });

        const clientes = await $.ajax({ type: "GET", url: APIURL_CLIENTES });
        clientes.forEach(c => {
            selectCliente.append(`<option value="${c._id}">${c.nombre || c._id}</option>`);
        });
    } catch (error) {
        console.error("Error al cargar Refugios o Clientes: ", error);
    }
}


$("#donacionFormulario").on("submit", function(e) {
    e.preventDefault();

    const datos = {
        idRefugio: $("#idRefugio").val(),
        idCliente: $("#idCliente").val(),
        montoCantidad: $("#montoCantidad").val(),
        fecha: $("#fecha").val(),
        descripcion: $("#descripcion").val()
    };


    if (!datos.idRefugio || !datos.idCliente) {
        alert("Debe seleccionar un Refugio y un Cliente válidos.");
        return;
    }

    if (modoEdicion) {
        $.ajax({
            type: "PUT",
            url: APIURL + idEdicion,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function () {
                $("#donacionFormulario")[0].reset();
                cargarDatos();
                cancelarEdicion();
                $("#modalDonacion").modal('hide'); 
                alert("Donación actualizada exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error al actualizar: ", error);
                alert("Fallo la actualización de la donación");
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: APIURL,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function () {
                $("#donacionFormulario")[0].reset();
                cargarDatos();
                $("#modalDonacion").modal('hide'); 
                alert("Donación guardada exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error al crear: ", error);
                alert("Fallo la inserción de la donación");
            }
        });
    }
});


$(document).on("click", ".btn-editar", function() {
    const id = $(this).data("id");

    $.ajax({
        type: "GET",
        url: APIURL + id,
        success: function (donacion) {
            cargarSelects().then(() => { 
                $("#idRefugio").val(donacion.idRefugio?._id || donacion.idRefugio);
                $("#idCliente").val(donacion.idCliente?._id || donacion.idCliente);
            });

            $("#montoCantidad").val(donacion.montoCantidad);
            $("#fecha").val(donacion.fecha);
            $("#descripcion").val(donacion.descripcion);

            modoEdicion = true;
            idEdicion = id;

            $("#btnSubmit").text("Actualizar");
            $("#btnCancelar").show();
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar donación: ", error);
            alert("Error al cargar la donación para editar");
        }
    });
});


$(document).on("click", ".btn-eliminar", function() {
    const id = $(this).data("id");
    
    if (confirm("¿Está seguro que desea eliminar este registro de donación?")) {
        $.ajax({
            type: "DELETE",
            url: APIURL + id,
            success: function () {
                cargarDatos();
                alert("Donación eliminada exitosamente");
            },
            error: function(xhr, status, error) {
                console.error("Error al eliminar: ", error);
                alert("Error al eliminar la donación");
            }
        });
    }
});


$("#btnAgregarDonacion").on("click", function() {
    cancelarEdicion();
    cargarSelects(); 
    $("#modalDonacion").modal("show");
});


$("#btnCancelar").on("click", function() {
    cancelarEdicion();
    $("#modalDonacion").modal('hide'); 
});

function cancelarEdicion() {
    modoEdicion = false; 
    idEdicion = null;
    $("#donacionFormulario")[0].reset();
    $("#btnSubmit").text("Guardar");
    $("#btnCancelar").hide();
}


$('#modalDonacion').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    const id = button.data('id');

    if (!id) {
        cancelarEdicion();
        cargarSelects();
    }
});


cargarDatos();
$("#btnCancelar").hide();
