$(document).ready(function () {

    const API_URL = "http://localhost:3000/Medicamento";
    const API_ANIMALES = "http://localhost:3000/Animal";

    cargarAnimales();
    cargarTabla();

    $("#btnNuevo").click(function () {
        limpiarCampos();
        $("#medId").val("");
        $("#modalMedicamento").modal("show");
    });

    $("#btnGuardar").click(function () {
        guardarMedicamento();
    });

    function cargarAnimales() {
        $.ajax({
            url: API_ANIMALES,
            method: "GET",
            success: function (data) {
                let opciones = `<option value="">Seleccione un animal</option>`;

                data.forEach(a => {
                    opciones += `<option value="${a._id}">${a.nombre}</option>`;
                });

                $("#idAnimal").html(opciones);
            }
        });
    }

    function cargarTabla() {
        $.ajax({
            url: API_URL,
            method: "GET",
            success: function (data) {
                let filas = "";

                data.forEach(m => {
                    filas += `
                        <tr>
                            <td>${m.idAnimal?.nombre ?? "SIN NOMBRE"}</td>
                            <td>${m.nombreMedicamento}</td>
                            <td>${m.dosis}</td>
                            <td>${m.fechaVencimiento}</td>
                            <td>
                                <button class="btn btn-warning btn-sm btnEditar" data-id="${m._id}">Editar</button>
                                <button class="btn btn-danger btn-sm btnEliminar" data-id="${m._id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });

                $("#tablaMedicamentos").html(filas);

                $(".btnEditar").click(cargarMedicamentoEditar);
                $(".btnEliminar").click(eliminarMedicamento);
            }
        });
    }

    function guardarMedicamento() {
        const id = $("#medId").val();

        const data = {
            idAnimal: $("#idAnimal").val(),
            nombreMedicamento: $("#nombreMedicamento").val(),
            dosis: $("#dosis").val(),
            fechaVencimiento: $("#fechaVencimiento").val()
        };

        if (!data.idAnimal || !data.nombreMedicamento || !data.dosis || !data.fechaVencimiento) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const metodo = id ? "PUT" : "POST";
        const url = id ? `${API_URL}/${id}` : API_URL;

        $.ajax({
            url: url,
            method: metodo,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function () {
                alert("Medicamento guardado correctamente.");
                $("#modalMedicamento").modal("hide");
                cargarTabla();
            },
            error: function () {
                alert("Error al guardar el medicamento.");
            }
        });
    }

    function cargarMedicamentoEditar() {
        const id = $(this).data("id");

        $.ajax({
            url: `${API_URL}/${id}`,
            method: "GET",
            success: function (m) {
                $("#medId").val(m._id);
                $("#idAnimal").val(m.idAnimal?._id);
                $("#nombreMedicamento").val(m.nombreMedicamento);
                $("#dosis").val(m.dosis);
                $("#fechaVencimiento").val(m.fechaVencimiento);

                $("#modalMedicamento").modal("show");
            }
        });
    }

    function eliminarMedicamento() {
        const id = $(this).data("id");

        if (!confirm("¿Seguro que deseas eliminar este medicamento?")) return;

        $.ajax({
            url: `${API_URL}/${id}`,
            method: "DELETE",
            success: function () {
                alert("Medicamento eliminado correctamente.");
                cargarTabla();
            },
            error: function () {
                alert("No se pudo eliminar.");
            }
        });
    }

    function limpiarCampos() {
        $("#idAnimal").val("");
        $("#nombreMedicamento").val("");
        $("#dosis").val("");
        $("#fechaVencimiento").val("");
    }

});
