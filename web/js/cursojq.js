const APIURL = "http://localhost:3000/api/curso/";

//Cagra la lista en la tabla

async function cargarDatos() {

    $.ajax({
        type: "GET",
        url: APIURL,
        success: function (responsecursos) {
            const tbody = $("#tablaDatos");
            tbody.empty();


            responsecursos.forEach(elementCurso => {
                    tbody.append(`
                                <tr class="">
                                    <td scope="row">${elementCurso._id}</td>
                                    <td>${elementCurso.nombre}</td>
                                    <td>${elementCurso.descripcion}</td>
                                    <td>${elementCurso.estado}</td>
                                    <td>${elementCurso.correo}</td>
                                    <td>
                                    
                                        <a
                                            name=""
                                            id=""
                                            class="btn btn-primary"
                                            href="#"
                                            role="button"
                                            >Editar</a>

                                        <a
                                                    name=""
                                                    id=""
                                                    class="btn btn-danger"
                                                    href="#"
                                                    role="button"
                                                    >Eliminar</a>
                                    </td>
                                </tr>
                    `);
                });


        }
    });



    // //Llamamos a la url
    // const res = await fetch(APIURL);

    // const cursos = await res.json();

    // const tbody = document.getElementById("tablaDatos");

    // tbody.innerHTML = '';


    // cursos.forEach(elementCurso => {
    //     tbody.innerHTML += `
    //                 <tr class="">
    //                     <td scope="row">${elementCurso._id}</td>
    //                     <td>${elementCurso.nombre}</td>
    //                     <td>${elementCurso.descripcion}</td>
    //                     <td>${elementCurso.estado}</td>
    //                     <td>${elementCurso.correo}</td>
    //                     <td>
                        
    //                         <a
    //                             name=""
    //                             id=""
    //                             class="btn btn-primary"
    //                             href="#"
    //                             role="button"
    //                             >Editar</a>

    //                         <a
    //                                     name=""
    //                                     id=""
    //                                     class="btn btn-danger"
    //                                     href="#"
    //                                     role="button"
    //                                     >Eliminar</a>
    //                     </td>
    //                 </tr>
    //     `;
    // });



    // console.log(cursos);
}



//Seccion de guardar
$("#cursoFormulario").on("submit", function(e) {
    e.preventDefault();
    


        const datos = {
            nombre: $("#nombre").val(),
            estado: $("#estado").val(),
            correo: $("#correo").val(),
            descripcion: $("#descripcion").val()
        }
                console.log(datos);
                console.log(JSON.stringify(datos));
        
        $.ajax({
            type: "POST",
            url: APIURL,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (response) {
                console.log(response);
                $("#cursoFormulario")[0].reset();
                cargarDatos();
            },
            error: function(xhr, status, error){
                console.error("Error: ", error);
                console.error("Error xhr: ", xhr.responseText);
                alert("Fallo la insercion");
            }
        });


    
});
// document.getElementById("cursoFormulario").addEventListener('submit', async e => {

//     e.preventDefault();

//     try {


//         const datos = {
//             nombre: document.getElementById("nombre").value,
//             estado: document.getElementById("estado").value,
//             correo: document.getElementById("correo").value,
//             descripcion: document.getElementById("descripcion").value,
//         }




//         await fetch(APIURL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(datos)
//         });



//         e.target.reset();
//         cargarDatos();
//     } catch (error) {
//         console.log("error" + error);
//     }

// });



cargarDatos();

// const CursoSchema = new mongoose.Schema(
//     {
//         //id: { type: Number, required: true, unique: true},
//         id: { type: Number},
//         nombre: { type: String},
//         descripcion: { type: String},
//         estado: { type: String}
//     }
// );