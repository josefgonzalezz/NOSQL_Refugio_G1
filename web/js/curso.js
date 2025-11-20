const APIURL = "http://localhost:3000/api/curso/";

//Cagra la lista en la tabla

async function cargarDatos() {

    //Llamamos a la url
    const res = await fetch(APIURL);

    const cursos = await res.json();

    const tbody = document.getElementById("tablaDatos");

    tbody.innerHTML = '';


    cursos.forEach(elementCurso => {
        tbody.innerHTML += `
                    <tr class="">
                        <td scope="row">${elementCurso._id}</td>
                        <td>${elementCurso.nombre}</td>
                        <td>${elementCurso.descripcion}</td>
                        <td>${elementCurso.correo}</td>
                        <td>${elementCurso.estado}</td>
                    </tr>
        `;
    });

    console.log(cursos);
}

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