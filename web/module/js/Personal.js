const APIURL_PERSONAL = "http://localhost:3000/api/personal/";
const APIURL_REFUGIOS = "http://localhost:3000/api/refugios/";

let modoEdicionPersonal = false;
let idEdicionPersonal = null;

function cargarRefugiosPersonal() {
    $.get(APIURL_REFUGIOS, function (refugios) {
        const select = $("#personalRefugio");
        select.empty();

        if (!refugios || refugios.length === 0) {
            select.append('<option value="">No hay refugios registrados</option>');
            return;
        }

        select.append('<option value="">Seleccione un refugio</option>');
        refugios.forEach(r => {
            select.append(`<option value="${r._id}">${r.nombre}</option>`);
        });
    }).fail(function (err) {
        console.error("Error al cargar refugios:", err);
        alert("Error al cargar la lista de refugios.");
    });
}

function cargarPersonal() {
    $.ajax({
        type: "GET",
        url: APIURL_PERSONAL,
        success: function (personal) {
            const tbody = $("#tablaPersonal");
            tbody.empty();

            if (!personal || personal.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="6" class="text-center">No hay personal registrado.</td>
                    </tr>
                `);
                return;
            }

            personal.forEach(p => {
                const refugioTexto = (p.idRefugio && p.idRefugio.nombre)
                    ? p.idRefugio.nombre
                    : (p.idRefugio || "");

                tbody.append(`
                    <tr>
                        <td>${refugioTexto}</td>
                        <td>${p.nombre}</td>
                        <td>${p.puesto}</td>
                        <td>${p.telefono}</td>
                        <td>${p.correo}</td>
                        <td>
                            <button class="btn btn-warning btn-sm btn-editar-personal" data-id="${p._id}">
                                Editar
                            </button>
                            <button class="btn btn-danger btn-sm btn-eliminar-personal" data-id="${p._id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar el personal:", error);
            alert("Error al cargar el personal.");
        }
    });
}

function limpiarFormularioPersonal() {
    $("#formPersonal")[0].reset();
    $("#personalId").val("");
    $("#tituloModalPersonal").text("Registrar personal");
    $("#btnGuardarPersonal").text("Guardar");
    modoEdicionPersonal = false;
    idEdicionPersonal = null;
}

$(document).ready(function () {
    cargarPersonal();

    $("#btnAgregarPersonal").on("click", function () {
        limpiarFormularioPersonal();
        cargarRefugiosPersonal();
        $("#modalPersonal").modal("show");
    });

    $("#formPersonal").on("submit", function (e) {
        e.preventDefault();

        const datos = {
            idRefugio: $("#personalRefugio").val(),
            nombre: $("#personalNombre").val(),
            puesto: $("#personalPuesto").val(),
            telefono: $("#personalTelefono").val(),
            correo: $("#personalCorreo").val()
        };

        if (!datos.idRefugio || !datos.nombre || !datos.puesto || !datos.telefono || !datos.correo) {
            alert("Por favor complete todos los campos obligatorios.");
            return;
        }

        const tipoPeticion = modoEdicionPersonal ? "PUT" : "POST";
        const url = modoEdicionPersonal ? APIURL_PERSONAL + idEdicionPersonal : APIURL_PERSONAL;

        $.ajax({
            type: tipoPeticion,
            url: url,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function () {
                alert(modoEdicionPersonal ? "Personal actualizado correctamente." : "Personal registrado correctamente.");
                $("#modalPersonal").modal("hide");
                limpiarFormularioPersonal();
                cargarPersonal();
            },
            error: function (xhr, status, error) {
                console.error("Error al guardar el personal:", error);
                alert("Ocurrió un error al guardar el registro de personal.");
            }
        });
    });

    $(document).on("click", ".btn-editar-personal", function () {
        const id = $(this).data("id");

        $.get(APIURL_PERSONAL + id, function (p) {
            modoEdicionPersonal = true;
            idEdicionPersonal = p._id;

            $("#tituloModalPersonal").text("Editar personal");
            $("#btnGuardarPersonal").text("Actualizar");

            $.get(APIURL_REFUGIOS, function (refugios) {
                const select = $("#personalRefugio");
                select.empty();

                refugios.forEach(r => {
                    select.append(`<option value="${r._id}">${r.nombre}</option>`);
                });

                $("#personalRefugio").val(p.idRefugio);
            });

            $("#personalNombre").val(p.nombre);
            $("#personalPuesto").val(p.puesto);
            $("#personalTelefono").val(p.telefono);
            $("#personalCorreo").val(p.correo);

            $("#modalPersonal").modal("show");
        }).fail(function (err) {
            console.error("Error al obtener el personal:", err);
            alert("No se pudo cargar la información de la persona seleccionada.");
        });
    });

    $(document).on("click", ".btn-eliminar-personal", function () {
        const id = $(this).data("id");

        if (!confirm("¿Está seguro de que desea eliminar este registro de personal?")) {
            return;
        }

        $.ajax({
            type: "DELETE",
            url: APIURL_PERSONAL + id,
            success: function () {
                alert("Registro de personal eliminado correctamente.");
                cargarPersonal();
            },
            error: function (xhr, status, error) {
                console.error("Error al eliminar el personal:", error);
                alert("Ocurrió un error al eliminar el registro de personal.");
            }
        });
    });
});