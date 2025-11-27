const APIURL_VISITAS  = "http://localhost:3000/api/visitas/";
const APIURL_REFUGIOS = "http://localhost:3000/api/refugios/";
const APIURL_USUARIOS = "http://localhost:3000/api/usuarios/";

let modoEdicionVisita = false;
let idEdicionVisita = null;


function cargarVisitas() {
    $.ajax({
        type: "GET",
        url: APIURL_VISITAS,
        success: function (visitas) {
            const tbody = $("#tablaVisitas");
            tbody.empty();

            if (!visitas || visitas.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="7" class="text-center">
                            No hay visitas registradas.
                        </td>
                    </tr>
                `);
                return;
            }

            visitas.forEach(function (visita) {
                tbody.append(`
                    <tr>
                        <td>${visita._id}</td>
                        <td>${visita.idRefugio || ""}</td>
                        <td>${visita.idCliente || ""}</td>
                        <td>${visita.fecha || ""}</td>
                        <td>${visita.hora || ""}</td>
                        <td>${visita.motivo || ""}</td>
                        <td>
                            <button class="btn btn-warning btn-sm btn-editar-visita" data-id="${visita._id}">
                                Editar
                            </button>
                            <button class="btn btn-danger btn-sm btn-eliminar-visita" data-id="${visita._id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function (err) {
            console.error("Error al cargar visitas:", err);
            alert("Error al cargar las visitas");
        }
    });
}


function cargarRefugiosVisita() {
    $.get(APIURL_REFUGIOS, function (refugios) {
        const select = $("#visitaRefugio");
        select.empty();

        if (!refugios || refugios.length === 0) {
            select.append('<option value="">No hay refugios registrados</option>');
            return;
        }

        select.append('<option value="">Seleccione un refugio</option>');
        refugios.forEach(function (r) {
            select.append(`<option value="${r._id}">${r.nombre}</option>`);
        });
    }).fail(function (err) {
        console.error("Error al cargar refugios:", err);
        alert("Error al cargar los refugios");
    });
}

function cargarUsuariosVisita() {
    $.get(APIURL_USUARIOS, function (usuarios) {
        const select = $("#visitaCliente");
        select.empty();

        if (!usuarios || usuarios.length === 0) {
            select.append('<option value="">No hay usuarios registrados</option>');
            return;
        }

        select.append('<option value="">Seleccione un cliente</option>');
        usuarios.forEach(function (u) {
            select.append(`<option value="${u._id}">${u.nombre}</option>`);
        });
    }).fail(function (err) {
        console.error("Error al cargar usuarios:", err);
        alert("Error al cargar los usuarios");
    });
}


function limpiarFormularioVisita() {
    $("#visitaFormulario")[0].reset();
    $("#visitaId").val("");
    $("#tituloModalVisita").text("Registrar visita");
    $("#btnSubmitVisita").text("Guardar");
    $("#btnCancelarVisita").hide();
    modoEdicionVisita = false;
    idEdicionVisita = null;
}


$(document).ready(function () {


    cargarVisitas();
    cargarRefugiosVisita();
    cargarUsuariosVisita();
    $("#btnCancelarVisita").hide();


    $("#btnAgregarVisita").on("click", function () {
        limpiarFormularioVisita();
        cargarRefugiosVisita();
        cargarUsuariosVisita();
        $("#modalVisita").modal("show");
    });


    $("#visitaFormulario").on("submit", function (e) {
        e.preventDefault();

        const datos = {
            idRefugio: $("#visitaRefugio").val(),
            idCliente: $("#visitaCliente").val(),
            fecha: $("#visitaFecha").val(),
            hora: $("#visitaHora").val(),
            motivo: $("#visitaMotivo").val()
        };

        if (!datos.idRefugio || !datos.idCliente || !datos.fecha || !datos.hora || !datos.motivo) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const tipoPeticion = modoEdicionVisita ? "PUT" : "POST";
        const urlPeticion  = modoEdicionVisita ? APIURL_VISITAS + idEdicionVisita : APIURL_VISITAS;
        const mensajeOK    = modoEdicionVisita ? "Visita actualizada correctamente" : "Visita registrada correctamente";

        $.ajax({
            type: tipoPeticion,
            url: urlPeticion,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function () {
                alert(mensajeOK);
                $("#modalVisita").modal("hide");
                limpiarFormularioVisita();
                cargarVisitas();
            },
            error: function (xhr, status, error) {
                console.error("Error al guardar la visita:", error);
                console.error("Detalle:", xhr.responseText);
                alert("Error al guardar la visita");
            }
        });
    });

    $("#btnCancelarVisita").on("click", function () {
        limpiarFormularioVisita();
        $("#modalVisita").modal("hide");
    });

    $(document).on("click", ".btn-editar-visita", function () {
        const id = $(this).data("id");

        $.ajax({
            type: "GET",
            url: APIURL_VISITAS + id,
            success: function (visita) {
                $.when(
                    $.get(APIURL_REFUGIOS),
                    $.get(APIURL_USUARIOS)
                ).done(function (refResp, usuResp) {
                    const refugios = refResp[0];
                    const usuarios = usuResp[0];

                    const selectRefugio = $("#visitaRefugio");
                    const selectCliente = $("#visitaCliente");

                    selectRefugio.empty();
                    refugios.forEach(r => {
                        selectRefugio.append(`<option value="${r._id}">${r.nombre}</option>`);
                    });

                    selectCliente.empty();
                    usuarios.forEach(u => {
                        selectCliente.append(`<option value="${u._id}">${u.nombre}</option>`);
                    });

                    $("#visitaId").val(visita._id);
                    $("#visitaRefugio").val(visita.idRefugio);
                    $("#visitaCliente").val(visita.idCliente);
                    $("#visitaFecha").val(visita.fecha || "");
                    $("#visitaHora").val(visita.hora || "");
                    $("#visitaMotivo").val(visita.motivo || "");

                    modoEdicionVisita = true;
                    idEdicionVisita   = id;

                    $("#tituloModalVisita").text("Editar visita");
                    $("#btnSubmitVisita").text("Actualizar");
                    $("#btnCancelarVisita").show();

                    $("#modalVisita").modal("show");
                });
            },
            error: function (xhr, status, error) {
                console.error("Error al obtener la visita:", error);
                alert("Error al cargar la información de la visita");
            }
        });
    });

    $(document).on("click", ".btn-eliminar-visita", function () {
        const id = $(this).data("id");

        if (!confirm("¿Está seguro de que desea eliminar esta visita?")) {
            return;
        }

        $.ajax({
            type: "DELETE",
            url: APIURL_VISITAS + id,
            success: function () {
                alert("Visita eliminada correctamente");
                cargarVisitas();
            },
            error: function (xhr, status, error) {
                console.error("Error al eliminar la visita:", error);
                alert("Error al eliminar la visita");
            }
        });
    });

});