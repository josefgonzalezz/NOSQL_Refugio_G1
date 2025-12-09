const APIURL_ANIMALES = "http://localhost:3000/api/animal/";
const APIURL_TIPOS = "http://localhost:3000/api/tiposAnimales/";
const APIURL_REFUGIOS = "http://localhost:3000/api/refugios/";
const APIURL_ADOPCIONES = "http://localhost:3000/api/adopcion/";

let modoEdicionAnimal = false;
let idEdicionAnimal = null;

function cargarAnimales() {
    $.ajax({
        type: "GET",
        url: APIURL_ANIMALES,
        success: function (animales) {
            generarCardsAnimales(animales);
        },
        error: function (err) {
            console.error("Error al cargar animales:", err);
            alert("Error al cargar animales");
        }
    });
}

function generarCardsAnimales(animales) {
    const contenedor = $("#contenedorAnimales");
    contenedor.empty();

    if (!animales || animales.length === 0) {
        contenedor.append(`<p class="text-center">No hay animales registrados.</p>`);
        return;
    }

    animales.forEach(animal => {
        contenedor.append(`
            <div class="col-md-4 mb-3">
                <div class="card shadow">
                    <img src="${animal.ruta_imagen || 'https://via.placeholder.com/300'}"
                         class="card-img-top"
                         style="height: 200px; object-fit: cover;">

                    <div class="card-body">
                        <h5 class="card-title">${animal.nombre}</h5>

                        <p>
                            <b>Tipo:</b> ${animal.idTipo?.tipo ?? "-"}<br>
                            <b>Raza:</b> ${animal.raza}<br>
                            <b>Edad:</b> ${animal.edad}<br>
                            <b>Sexo:</b> ${animal.sexo}<br>
                            <b>Salud:</b> ${animal.salud}
                        </p>

                        <button class="btn btn-primary btn-sm btn-adoptar-animal" 
                                data-id="${animal._id}">
                            Adoptar
                        </button>

                        <button class="btn btn-warning btn-sm btn-editar-animal" 
                                data-id="${animal._id}">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm btn-eliminar-animal" 
                                data-id="${animal._id}">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `);
    });
}

function cargarTipos() {
    $.get(APIURL_TIPOS, function (tipos) {
        const select = $("#animalTipo");
        select.empty();
        tipos.forEach(t => {
            select.append(`<option value="${t._id}">${t.tipo}</option>`);
        });
    });
}

function cargarRefugios() {
    $.get(APIURL_REFUGIOS, function (refs) {
        const select = $("#animalRefugio");
        select.empty();
        refs.forEach(r => {
            select.append(`<option value="${r._id}">${r.nombre}</option>`);
        });
    });
}

function cancelarEdicionAnimal() {
    modoEdicionAnimal = false;
    idEdicionAnimal = null;
    $("#formAnimal")[0].reset();
    $("#tituloModalAnimal").text("Nuevo Animal");
    $("#btnSubmitAnimal").text("Guardar");
    $("#btnCancelarAnimal").hide();
}

$(document).ready(function () {

    cargarAnimales();
    cargarTipos();
    cargarRefugios();
    $("#btnCancelarAnimal").hide();

    $("#btnAgregarAnimal").on("click", function () {
        cancelarEdicionAnimal();
        cargarTipos();
        cargarRefugios();
        const modalAnimal = new bootstrap.Modal(document.getElementById("modalAnimal"));
        modalAnimal.show();
    });

    $("#formAnimal").on("submit", function (e) {
        e.preventDefault();

        const datos = {
            nombre: $("#animalNombre").val(),
            edad: $("#animalEdad").val(),
            raza: $("#animalRaza").val(),
            sexo: $("#animalSexo").val(),
            salud: $("#animalSalud").val(),
            idTipo: $("#animalTipo").val(),
            idRefugio: $("#animalRefugio").val(),
            ruta_imagen: $("#animalImagen").val()
        };

        const tipo = modoEdicionAnimal ? "PUT" : "POST";
        const url = modoEdicionAnimal ? APIURL_ANIMALES + idEdicionAnimal : APIURL_ANIMALES;
        const msj = modoEdicionAnimal ? "actualizado" : "guardado";

        $.ajax({
            type: tipo,
            url: url,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function () {
                cargarAnimales();
                cancelarEdicionAnimal();
                bootstrap.Modal.getInstance(document.getElementById("modalAnimal")).hide();
                alert(`Animal ${msj} correctamente`);
            },
            error: function (err) {
                console.error(err);
                alert("Error al guardar el animal");
            }
        });
    });

    $("#btnCancelarAnimal").on("click", function () {
        cancelarEdicionAnimal();
        bootstrap.Modal.getInstance(document.getElementById("modalAnimal")).hide();
    });


    $(document).on("click", ".btn-editar-animal", function () {
        const id = $(this).data("id");

        $.ajax({
            type: "GET",
            url: APIURL_ANIMALES + id,
            success: function (animal) {

                $.when(
                    $.get(APIURL_TIPOS),
                    $.get(APIURL_REFUGIOS)
                ).done(function(tiposResponse, refugiosResponse) {

                    const selectTipo = $("#animalTipo");
                    selectTipo.empty();
                    tiposResponse[0].forEach(t => {
                        selectTipo.append(`<option value="${t._id}">${t.tipo}</option>`);
                    });

                    const selectRefugio = $("#animalRefugio");
                    selectRefugio.empty();
                    refugiosResponse[0].forEach(r => {
                        selectRefugio.append(`<option value="${r._id}">${r.nombre}</option>`);
                    });

                    $("#animalNombre").val(animal.nombre);
                    $("#animalEdad").val(animal.edad);
                    $("#animalRaza").val(animal.raza);
                    $("#animalSexo").val(animal.sexo);
                    $("#animalSalud").val(animal.salud);
                    $("#animalTipo").val(animal.idTipo?._id || animal.idTipo);
                    $("#animalRefugio").val(animal.idRefugio?._id || animal.idRefugio);
                    $("#animalImagen").val(animal.ruta_imagen || ""); // 👉 NUEVO

                    modoEdicionAnimal = true;
                    idEdicionAnimal = id;

                    $("#tituloModalAnimal").text("Editar Animal");
                    $("#btnSubmitAnimal").text("Actualizar");
                    $("#btnCancelarAnimal").show();

                    const modalAnimal = new bootstrap.Modal(document.getElementById("modalAnimal"));
                    modalAnimal.show();
                });
            },
            error: function () {
                alert("Error al cargar el animal");
            }
        });
    });


    $(document).on("click", ".btn-eliminar-animal", function () {
        const id = $(this).data("id");

        if (!confirm("¿Eliminar este animal?")) return;

        $.ajax({
            type: "DELETE",
            url: APIURL_ANIMALES + id,
            success: function () {
                cargarAnimales();
                alert("Animal eliminado correctamente");
            },
            error: function () {
                alert("Error al eliminar el animal");
            }
        });
    });


    $(document).on("click", ".btn-adoptar-animal", function () {
        const idAnimal = $(this).data("id");
        
        $("#formAdopcion")[0].reset();
        $("#idAnimalAdop").val(idAnimal);

        const hoy = new Date().toISOString().split('T')[0];
        $("#fechaAdopcion").val(hoy);

        const modalAdopcion = new bootstrap.Modal(document.getElementById("modalAdopcion"));
        modalAdopcion.show();
    });

    $("#formAdopcion").on("submit", function (e) {
        e.preventDefault();

        const idAnimal = $("#idAnimalAdop").val();
        const idCliente = $("#idClienteAdop").val();
        const fechaAdopcion = $("#fechaAdopcion").val();
        const observaciones = $("#observaciones").val();

        if (!idAnimal || !idCliente || !fechaAdopcion) {
            alert("Por favor complete todos los campos requeridos");
            return;
        }

        const datos = {
            idAnimal,
            idCliente,
            fechaAdopcion,
            estado: "Pendiente",
            observaciones
        };

        $.ajax({
            type: "POST",
            url: APIURL_ADOPCIONES,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (response) {
                alert("Adopción registrada correctamente.");
                bootstrap.Modal.getInstance(document.getElementById("modalAdopcion")).hide();
                $("#formAdopcion")[0].reset();
                cargarAnimales();
            },
            error: function (err) {
                let mensajeError = "Error al registrar la adopción";
                if (err.responseJSON?.mensaje) {
                    mensajeError += ": " + err.responseJSON.mensaje;
                }
                alert(mensajeError);
            }
        });
    });

});
