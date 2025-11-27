const APIURL_REFUGIOS = "http://localhost:3000/api/refugios/";

let modoEdicionRefugio = false;
let idEdicionRefugio = null;

function cargarRefugios() {
    $.get(APIURL_REFUGIOS, function(refugios) {
        const contenedor = $("#contenedorRefugios");
        contenedor.empty();

        if (!refugios || refugios.length === 0) {
            contenedor.append('<p class="text-center">No hay refugios registrados.</p>');
            return;
        }

        refugios.forEach(r => {
            const direccionTexto = r.direccion 
                ? `${r.direccion.provincia}, ${r.direccion.canton}, ${r.direccion.distrito}` 
                : 'Sin dirección';
            
            const detallesTexto = r.direccion?.detalles || 'Sin detalles adicionales';
            
            contenedor.append(`
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card shadow h-100">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${r.nombre}</h5>
                            <p class="text-muted small">${r.descripcion}</p>
                            <hr>
                            <p class="mb-1"><b> Fundación:</b> ${new Date(r.fechaFundacion).toLocaleDateString('es-CR')}</p>
                            <p class="mb-1"><b> Teléfono:</b> ${r.telefono}</p>
                            <p class="mb-1"><b> Correo:</b> ${r.correo}</p>
                            <p class="mb-1"><b> Capacidad:</b> ${r.capacidad} animales</p>
                            <hr>
                            <p class="mb-1"><b> Dirección:</b><br>${direccionTexto}</p>
                            <p class="mb-2 text-muted small">${detallesTexto}</p>
                            <div class="d-flex gap-2 mt-3">
                                <button class="btn btn-warning btn-sm flex-fill btn-editar-refugio" data-id="${r._id}">
                                     Editar
                                </button>
                                <button class="btn btn-danger btn-sm flex-fill btn-eliminar-refugio" data-id="${r._id}">
                                     Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    });
}

function cancelarEdicionRefugio() {
    modoEdicionRefugio = false;
    idEdicionRefugio = null;
    $("#formRefugio")[0].reset();
    $("#tituloModalRefugio").text("Nuevo Refugio");
    $("#btnSubmitRefugio").text("Guardar");
    $("#btnCancelarRefugio").hide();
}

$(document).ready(function() {
    cargarRefugios();
    $("#btnCancelarRefugio").hide();

    $("#btnAgregarRefugio").click(function() {
        cancelarEdicionRefugio();
        $("#modalRefugio").modal("show");
    });

    $("#formRefugio").submit(function(e) {
        e.preventDefault();

        const datos = {
            nombre: $("#refNombre").val(),
            descripcion: $("#refDescripcion").val(),
            fechaFundacion: $("#refFechaFundacion").val(),
            capacidad: parseInt($("#refCapacidad").val()),
            correo: $("#refCorreo").val(),
            telefono: $("#refTelefono").val(),
            provincia: $("#refProvincia").val(),
            canton: $("#refCanton").val(),
            distrito: $("#refDistrito").val(),
            detalles: $("#refDetalles").val()
        };

        const tipo = modoEdicionRefugio ? "PUT" : "POST";
        const url = modoEdicionRefugio ? APIURL_REFUGIOS + idEdicionRefugio : APIURL_REFUGIOS;

        $.ajax({
            type: tipo,
            url: url,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function() {
                cargarRefugios();
                cancelarEdicionRefugio();
                $("#modalRefugio").modal("hide");
                alert(modoEdicionRefugio ? "Refugio actualizado correctamente" : "Refugio creado correctamente");
            },
            error: function(error) {
                alert("Error al guardar el refugio: " + (error.responseJSON?.mensaje || "Error desconocido"));
            }
        });
    });

    $(document).on("click", ".btn-editar-refugio", function() {
        const id = $(this).data("id");
        $.get(APIURL_REFUGIOS + id, function(r) {
            $("#refNombre").val(r.nombre);
            $("#refDescripcion").val(r.descripcion);
            $("#refFechaFundacion").val(r.fechaFundacion);
            $("#refTelefono").val(r.telefono);
            $("#refCorreo").val(r.correo);
            $("#refCapacidad").val(r.capacidad);
            $("#refProvincia").val(r.direccion?.provincia || "");
            $("#refCanton").val(r.direccion?.canton || "");
            $("#refDistrito").val(r.direccion?.distrito || "");
            $("#refDetalles").val(r.direccion?.detalles || "");

            modoEdicionRefugio = true;
            idEdicionRefugio = id;

            $("#tituloModalRefugio").text("Editar Refugio");
            $("#btnSubmitRefugio").text("Actualizar");
            $("#btnCancelarRefugio").show();
            $("#modalRefugio").modal("show");
        });
    });

    $(document).on("click", ".btn-eliminar-refugio", function() {
        const id = $(this).data("id");
        if (!confirm("¿Está seguro de que desea eliminar este refugio? Esta acción no se puede deshacer.")) return;

        $.ajax({
            type: "DELETE",
            url: APIURL_REFUGIOS + id,
            success: function() {
                cargarRefugios();
                alert("Refugio eliminado correctamente");
            },
            error: function(error) {
                alert("Error al eliminar el refugio: " + (error.responseJSON?.mensaje || "Error desconocido"));
            }
        });
    });
});