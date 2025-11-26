const APIURL_TIPOS = "http://localhost:3000/api/tipos/";

let modoEdicionTipo = false;
let idEdicionTipo = null;

function cargarTipos() {
    $.ajax({
        type: "GET",
        url: APIURL_TIPOS,
        success: function(tipos) {
            const tbody = $("#tablaTipos");
            tbody.empty();

            if (tipos && tipos.length > 0) {
                tipos.forEach(tipo => {
                    tbody.append(`
                        <tr>
                            <td>${tipo._id}</td>
                            <td>${tipo.tipo}</td>
                            <td>
                                <button class="btn btn-warning btn-sm btn-editar-tipo" data-id="${tipo._id}">
                                    Editar
                                </button>
                                <button class="btn btn-danger btn-sm btn-eliminar-tipo" data-id="${tipo._id}">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `);
                });
            } else {
                tbody.append('<tr><td colspan="3" class="text-center">No hay tipos de animales registrados.</td></tr>');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar tipos:", error);
            alert("Error al cargar los tipos de animales");
        }
    });
}

function cancelarEdicionTipo() {
    modoEdicionTipo = false;
    idEdicionTipo = null;
    $("#formTipo")[0].reset();
    $("#btnSubmitTipo").text("Guardar");
    $("#btnCancelarTipo").hide();
}

$(document).ready(function() {
    $("#formTipo").on("submit", function(e) {
        e.preventDefault();

        const datos = { tipo: $("#tipoNombre").val() };

        const tipoPeticion = modoEdicionTipo ? "PUT" : "POST";
        const urlPeticion = modoEdicionTipo ? APIURL_TIPOS + idEdicionTipo : APIURL_TIPOS;

        $.ajax({
            type: tipoPeticion,
            url: urlPeticion,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function(response) {
                cargarTipos();
                cancelarEdicionTipo();
                alert(`Tipo de animal ${modoEdicionTipo ? "actualizado" : "guardado"} exitosamente`);
                $('#modalTipo').modal('hide');
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Fallo la operación");
            }
        });
    });

    $(document).on("click", ".btn-editar-tipo", function() {
        const id = $(this).data("id");
        $.ajax({
            type: "GET",
            url: APIURL_TIPOS + id,
            success: function(tipo) {
                $("#tipoNombre").val(tipo.tipo);
                modoEdicionTipo = true;
                idEdicionTipo = id;
                $("#btnSubmitTipo").text("Actualizar");
                $("#btnCancelarTipo").show();
                $('#modalTipo').modal('show');
            },
            error: function(xhr, status, error) {
                console.error("Error al cargar tipo:", error);
                alert("Error al cargar el tipo de animal para editar");
            }
        });
    });

    $(document).on("click", ".btn-eliminar-tipo", function() {
        const id = $(this).data("id");
        if (confirm("¿Está seguro que desea eliminar este tipo de animal?")) {
            $.ajax({
                type: "DELETE",
                url: APIURL_TIPOS + id,
                success: function(response) {
                    cargarTipos();
                    alert("Tipo de animal eliminado exitosamente");
                },
                error: function(xhr, status, error) {
                    console.error("Error al eliminar tipo:", error);
                    alert("Error al eliminar el tipo de animal");
                }
            });
        }
    });

    $("#btnCancelarTipo").on("click", function() {
        cancelarEdicionTipo();
        $('#modalTipo').modal('hide');
    });

    cargarTipos();
    $("#btnCancelarTipo").hide();
});
