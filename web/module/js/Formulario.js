const APIURL_FORMULARIO = "http://localhost:3000/api/formulario/";
const APIURL_REFUGIOS = "http://localhost:3000/api/refugios/";
const APIURL_USUARIOS = "http://localhost:3000/api/usuarios/";

function cargarRefugiosFormulario() {
    $.get(APIURL_REFUGIOS, function (refugios) {
        const select = $("#idRefugioForm");
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

function cargarUsuariosFormulario() {
    $.get(APIURL_USUARIOS, function (usuarios) {
        const select = $("#idClienteForm");
        select.empty();

        if (!usuarios || usuarios.length === 0) {
            select.append('<option value="">No hay usuarios registrados</option>');
            return;
        }

        select.append('<option value="">Seleccione su nombre</option>');
        usuarios.forEach(u => {
            select.append(`<option value="${u._id}">${u.nombre} - ${u.correo}</option>`);
        });
    }).fail(function (err) {
        console.error("Error al cargar usuarios:", err);
        alert("Error al cargar la lista de usuarios.");
    });
}

function ponerFechaHoy() {
    const hoy = new Date().toISOString().slice(0, 10);
    $("#fechaForm").val(hoy);
}

$(document).ready(function () {
    cargarRefugiosFormulario();
    cargarUsuariosFormulario();
    ponerFechaHoy();

    $("#formConoceMas").on("submit", function (e) {
        e.preventDefault();

        const datos = {
            idRefugio: $("#idRefugioForm").val(),
            idCliente: $("#idClienteForm").val(),
            fecha: $("#fechaForm").val(),
            calificacion: parseInt($("#calificacionForm").val(), 10),
            comentario: $("#comentarioForm").val()
        };

        if (!datos.idRefugio || !datos.idCliente || !datos.fecha || !datos.calificacion || !datos.comentario) {
            alert("Por favor completa todos los campos del formulario.");
            return;
        }

        if (datos.calificacion < 1 || datos.calificacion > 5 || isNaN(datos.calificacion)) {
            alert("La calificación debe estar entre 1 y 5.");
            return;
        }

        $.ajax({
            type: "POST",
            url: APIURL_FORMULARIO,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function () {
                alert("Formulario enviado correctamente. ¡Gracias por escribirnos!");
                $("#formConoceMas")[0].reset();
                ponerFechaHoy();
            },
            error: function (xhr, status, error) {
                console.error("Error al enviar el formulario:", error);
                console.error("Detalle:", xhr.responseText);
                alert("Ocurrió un error al enviar el formulario. Inténtalo de nuevo más tarde.");
            }
        });
    });
});
