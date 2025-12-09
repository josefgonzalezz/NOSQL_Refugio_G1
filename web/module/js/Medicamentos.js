const APIURL = "http://localhost:3000/api/Medicamentos/";
const APIANIMALES = "http://localhost:3000/api/Animal/";

let modoEdicion = false;
let idEdicion = null;


function cargarMedicamentos() {
    $.ajax({
        type: "GET",
        url: APIURL,
        success: function (respuesta) {
            const tbody = $("#tablaMedicamentos");
            tbody.empty();

            respuesta.forEach(medicamento => {
                const idAnimal = medicamento.idAnimal?._id || medicamento.idAnimal;

                tbody.append(`
                    <tr>
                        <td>${medicamento._id}</td>
                        <td>${idAnimal}</td>
                        <td>${medicamento.nombreMedicamento}</td>
                        <td>${medicamento.dosis}</td>
                        <td>${medicamento.fechaVencimiento}</td>
                        <td>
                            <button class="btn btn-primary btn-editar" data-id="${medicamento._id}">
                                Editar
                            </button>
                            <button class="btn btn-danger btn-eliminar" data-id="${medicamento._id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function () {
            alert("Error al cargar medicamentos");
        }
    });
}


function cargarAnimales() {
    $.ajax({
        type: "GET",
        url: APIANIMALES,
        success: function (animales) {
            const select = $("#idAnimal");
            select.empty();
            select.append(`<option value="">Seleccione un animal</option>`);

            animales.forEach(animal => {
                select.append(`
                    <option value="${animal._id}">
                        ${animal._id}
                    </option>
                `);
            });
        },
        error: function () {
            alert("Error al cargar animales");
        }
    });
}

$("#btnNuevo").on("click", function () {
    modoEdicion = false;
    idEdicion = null;

    $("#medicamentoFormulario")[0].reset();
    $("#btnGuardar").text("Guardar");

    const modal = new bootstrap.Modal(document.getElementById("modalMedicamento"));
    modal.show();
});

$("#medicamentoFormulario").on("submit", function (e) {
    e.preventDefault();

    const datos = {
        idAnimal: $("#idAnimal").val(),
        nombreMedicamento: $("#nombreMedicamento").val(),
        dosis: $("#dosis").val(),
        fechaVencimiento: $("#fechaVencimiento").val()
    };

    if (modoEdicion) {
        $.ajax({
            type: "PUT",
            url: APIURL + idEdicion,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function () {
                cargarMedicamentos();
                $("#modalMedicamento").modal("hide");
                alert("Medicamento actualizado");
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: APIURL,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function () {
                cargarMedicamentos();
                $("#modalMedicamento").modal("hide");
                alert("Medicamento guardado");
            }
        });
    }
});

$(document).on("click", ".btn-editar", function () {
    const id = $(this).data("id");

    $.ajax({
        type: "GET",
        url: APIURL + id,
        success: function (medicamento) {
            $("#idAnimal").val(medicamento.idAnimal?._id || medicamento.idAnimal);
            $("#nombreMedicamento").val(medicamento.nombreMedicamento);
            $("#dosis").val(medicamento.dosis);
            $("#fechaVencimiento").val(medicamento.fechaVencimiento);

            modoEdicion = true;
            idEdicion = id;

            $("#btnGuardar").text("Actualizar");

            const modal = new bootstrap.Modal(document.getElementById("modalMedicamento"));
            modal.show();
        }
    });
});
$(document).on("click", ".btn-eliminar", function () {
    const id = $(this).data("id");

    if (confirm("¿Desea eliminar este medicamento?")) {
        $.ajax({
            type: "DELETE",
            url: APIURL + id,
            success: function () {
                cargarMedicamentos();
                alert("Medicamento eliminado");
            }
        });
    }
});

$("#btnCancelar").on("click", function () {
    $("#modalMedicamento").modal("hide");
    modoEdicion = false;
    idEdicion = null;
});

cargarMedicamentos();
cargarAnimales();
