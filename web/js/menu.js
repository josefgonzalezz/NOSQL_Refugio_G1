const menus = `
       
    <ul
        class="nav justify-content-center  "
      >
        <li class="nav-item">
            <a class="nav-link active" href="#" aria-current="page"
                >Active link</a
            >
        </li>
        <li class="nav-item">
            <a class="nav-link" href="curso.html">curso</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="cursojq.html">cursojq</a>
        </li>
      </ul>
`;



const htmlseccionMenu = $("#seccionMenu");
htmlseccionMenu.append(menus);