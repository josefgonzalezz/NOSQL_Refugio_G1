

class MedicamentosApp {

    constructor() {
        this.api = "http://localhost:3000/medicamentos";
        this.tabla = $("#tablaMedicamentos");
        this.modal = new bootstrap.Modal(document.getElementById("modalMedicamento"));

        this.initEventos();
        this.listar();
    }

    initEventos() {

        $("#btnNuevo").on("click", () => {
            this.limpiarFormulario();
            this.modal.show();
        });

        $("#btnGuardar").on("click", () => {
            const id = $("#medId").val();
            id ? this.actualizar(id) : this.crear();
        });
    }

    limpiarFormulario() {
        $("#medId").val("");
        $("#idAnimal").val("");
        $("#nombreMedicamento").val("");
        $("#dosis").val("");
        $("#fechaVencimiento").val("");
    }

    listar() {
        $.get(this.api, (data) => {
            this.tabla.empty();

            data.forEach(m => {
                this.tabla.append(`
                    <tr>
                        <td>${m.idAnimal}</td>
                        <td>${m.nombreMedicamento}</td>
                        <td>${m.dosis}</td>
                        <td>${m.fechaVencimiento}</td>
                        <td>
                            <button class="btn-editar" onclick="app.editar('${m._id}')">Editar</button>
                            <button class="btn-eliminar" onclick="app.eliminar('${m._id}')">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
        });
    }


    crear() {
        const datos = {
            idAnimal: $("#idAnimal").val(),
            nombreMedicamento: $("#nombreMedicamento").val(),
            dosis: $("#dosis").val(),
            fechaVencimiento: $("#fechaVencimiento").val(),
        };

        $.ajax({
            url: this.api,
            type: "POST",
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: () => {
                this.modal.hide();
                this.listar();
            }
        });
    }


    actualizar(id) {
        const datos = {
            idAnimal: $("#idAnimal").val(),
            nombreMedicamento: $("#nombreMedicamento").val(),
            dosis: $("#dosis").val(),
            fechaVencimiento: $("#fechaVencimiento").val(),
        };

        $.ajax({
            url: `${this.api}/${id}`,
            type: "PUT",
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: () => {
                this.modal.hide();
                this.listar();
            }
        });
    }


    editar(id) {
        $.get(`${this.api}/${id}`, (m) => {

            $("#medId").val(m._id);
            $("#idAnimal").val(m.idAnimal);
            $("#nombreMedicamento").val(m.nombreMedicamento);
            $("#dosis").val(m.dosis);
            $("#fechaVencimiento").val(m.fechaVencimiento);

            this.modal.show();
        });
    }


    eliminar(id) {
        if (!confirm("¿Eliminar registro?")) return;

        $.ajax({
            url: `${this.api}/${id}`,
            type: "DELETE",
            success: () => this.listar()
        });
    }
}

const app = new MedicamentosApp();
