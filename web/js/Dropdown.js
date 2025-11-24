/**
 * Clase para manejar la funcionalidad de un menú desplegable (Dropdown).
 * Requiere que el botón tenga el atributo 'data-dropdown-toggle' 
 * y el menú tenga el 'id' correspondiente.
 */
class DropdownHandler {
    
    constructor() {
        // Inicializa los manejadores de eventos cuando se crea la instancia.
        this.initializeEvents();
    }

    /**
     * Alterna la visibilidad del menú desplegable.
     * @param {Event} event - El evento de clic del botón.
     */
    toggleDropdown(event) {
        // Previene el comportamiento por defecto (si el botón está en un formulario)
        event.preventDefault(); 
        
        // 1. Obtener el ID del menú objetivo
        const button = event.currentTarget;
        const menuId = button.getAttribute('data-dropdown-toggle');
        const menu = document.getElementById(menuId);
        
        if (!menu) return; // Si no encuentra el menú, sale.

        // 2. Ocultar todos los demás menús (para cerrar automáticamente)
        this.closeAllOtherDropdowns(menu);

        // 3. Alternar la clase 'mostrar-menu' en el menú actual
        menu.classList.toggle('mostrar-menu');
    }

    /**
     * Cierra todos los menús desplegables excepto el excluido.
     * @param {HTMLElement} excludedMenu - El menú a excluir del cierre.
     */
    closeAllOtherDropdowns(excludedMenu) {
        const dropdowns = document.querySelectorAll('.menu-desplegable-contenido');
        
        dropdowns.forEach(openDropdown => {
            // Si el menú tiene la clase 'mostrar-menu' y NO es el menú excluido
            if (openDropdown.classList.contains('mostrar-menu') && openDropdown !== excludedMenu) {
                openDropdown.classList.remove('mostrar-menu');
            }
        });
    }

    /**
     * Cierra cualquier menú abierto si el clic ocurre fuera del contenedor.
     * @param {Event} event - El evento de clic en la ventana.
     */
    closeOnOutsideClick(event) {
        // Si el clic no fue dentro de un contenedor de dropdown, cierra todos.
        if (!event.target.closest('.menu-desplegable-contenedor')) {
            const dropdowns = document.querySelectorAll('.menu-desplegable-contenido.mostrar-menu');
            dropdowns.forEach(openDropdown => {
                openDropdown.classList.remove('mostrar-menu');
            });
        }
    }

    /**
     * Inicializa todos los event listeners necesarios.
     */
    initializeEvents() {
        // 1. Manejador de clic para los botones de dropdown
        document.addEventListener('click', (event) => {
            if (event.target.matches('.menu-desplegable-boton')) {
                this.toggleDropdown(event);
            }
        });

        // 2. Manejador de clic para cerrar el menú al hacer clic fuera
        window.addEventListener('click', (event) => {
            this.closeOnOutsideClick(event);
        }, true); // Usamos captura para asegurar que se ejecuta antes que otros listeners
    }
}

// Inicialización: Crea una instancia de la clase cuando el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    new DropdownHandler();
});