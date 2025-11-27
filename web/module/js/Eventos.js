const APIURL_EVENTOS = "http://localhost:3000/api/evento/";
const APIURL_REFUGIOS = "http://localhost:3000/api/refugios/";

let modoEdicionEvento = false;
let idEdicionEvento = null;

async function cargarEventos() {
    $.ajax({
        type: "GET",
        url: APIURL_EVENTOS,
        success: function (eventos) {
            const contenedor = $("#contenedorEventos");
            contenedor.empty();

            if (!eventos || eventos.length === 0) {
                contenedor.append(`<p class="text-center">No hay eventos registrados.</p>`);
                return;
            }

            eventos.forEach(evento => {
                contenedor.append(`
                    <div class="col-md-4 mb-3">
                        <div class="card shadow">
                            <div class="card-body">
                                <h5 class="card-title">${evento.motivo}</h5>
                                <p>
                                    <b>Refugio:</b> ${evento.idRefugio?._id || "-"}<br>
                                    <b>Fecha:</b> ${evento.fecha}<br>
                                    <b>Hora:</b> ${evento.hora}<br>
                                    <b>Comentario:</b> ${evento.comentario}
                                </p>
                                <button class="btn btn-warning btn-sm btn-editar-evento" data-id="${evento._id}" data-bs-toggle="modal" data-bs-target="#modalEvento">
                                    Editar
                                </button>
                                <button class="btn btn-danger btn-sm btn-eliminar-evento" data-id="${evento._id}">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                `);
            });
        },
        error: function (err) {
            console.error("Error al cargar eventos:", err);
            alert("Error al cargar eventos");
        }
    });
}


function cargarRefugios() {
    $.get(APIURL_REFUGIOS, function (refs) {
        const select = $("#eventoRefugio");
        select.empty();
        refs.forEach(r => {
            select.append(`<option value="${r._id}">${r.nombre}</option>`);
        });
    });
}


function cancelarEdicionEvento() {
    modoEdicionEvento = false;
    idEdicionEvento = null;
    $("#formEvento")[0].reset();
    $("#tituloModalEvento").text("Nuevo Evento");
    $("#btnSubmitEvento").text("Guardar");
    $("#btnCancelarEvento").hide();
}


$(document).ready(function () {
    cargarEventos();
    cargarRefugios();
    $("#btnCancelarEvento").hide();


    $("#btnAgregarEvento").on("click", function () {
        cancelarEdicionEvento();
        cargarRefugios();
        $("#modalEvento").modal("show");
    });


    $("#formEvento").on("submit", function (e) {
        e.preventDefault();

        const datos = {
            idRefugio: $("#eventoRefugio").val(),
            fecha: $("#eventoFecha").val(),
            hora: $("#eventoHora").val(),
            motivo: $("#eventoMotivo").val(),
            comentario: $("#eventoComentario").val()
        };

        const tipo = modoEdicionEvento ? "PUT" : "POST";
        const url = modoEdicionEvento ? APIURL_EVENTOS + idEdicionEvento : APIURL_EVENTOS;
        const msj = modoEdicionEvento ? "actualizado" : "guardado";

        $.ajax({
            type: tipo,
            url: url,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function () {
                cargarEventos();
                cancelarEdicionEvento();
                $("#modalEvento").modal("hide");
                alert(`Evento ${msj} correctamente`);
            },
            error: function (err) {
                console.error(err);
                alert("Error al guardar el evento");
            }
        });
    });

    $(document).on("click", ".btn-editar-evento", function () {
        const id = $(this).data("id");

        $.ajax({
            type: "GET",
            url: APIURL_EVENTOS + id,
            success: function (evento) {
                cargarRefugios(); 

                setTimeout(() => {
                    $("#eventoRefugio").val(evento.idRefugio?._id || evento.idRefugio);
                    $("#eventoFecha").val(evento.fecha);
                    $("#eventoHora").val(evento.hora);
                    $("#eventoMotivo").val(evento.motivo);
                    $("#eventoComentario").val(evento.comentario);

                    modoEdicionEvento = true;
                    idEdicionEvento = id;

                    $("#tituloModalEvento").text("Editar Evento");
                    $("#btnSubmitEvento").text("Actualizar");
                    $("#btnCancelarEvento").show();

                    $("#modalEvento").modal("show");
                }, 100);
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar evento:", error);
                alert("Error al cargar los datos del evento");
            }
        });
    });

    $(document).on("click", ".btn-eliminar-evento", function () {
        const id = $(this).data("id");

        if (!confirm("¿Eliminar este evento?")) return;

        $.ajax({
            type: "DELETE",
            url: APIURL_EVENTOS + id,
            success: function () {
                cargarEventos();
                alert("Evento eliminado correctamente");
            },
            error: function () {
                alert("Error al eliminar el evento");
            }
        });
    });

    // Botón cancelar
    $("#btnCancelarEvento").on("click", function () {
        cancelarEdicionEvento();
        $("#modalEvento").modal("hide");
    });
});
