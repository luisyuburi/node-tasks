const { formatRelative, subDays, format } = require("date-fns");
const { es } = require("date-fns/locale");
require("colors");

const {
  inquirerMenu,
  pausa,
  readInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist,
} = require("./helpers/inquirer");
const Tareas = require("./models/tareas");
const { guardarDB, leerDB } = require("./helpers/guardarArchivo");

const main = async () => {
  console.clear();
  let opt = "";
  const tareas = new Tareas();
  const tareasDB = leerDB();

  if (tareasDB) {
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        // Crear opcion
        const desc = await readInput("Descripcion:");
        tareas.crearTarea(desc);
        break;
      case "2": // Listar todas
        tareas.listadoCompleto(tareasDB);
        break;
      case "3": // Listar completadas
        tareas.listarPendientesCompletadas(true);
        break;
      case "4": // Listar pendientes
        tareas.listarPendientesCompletadas(false);
        break;
      case "5": // Completado | Pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case "6": // Borrar
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== 0) {
          const ok = await confirmar("¿Estás seguro que deseas borrar?");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("\n Tarea eliminada exitosamente!".bold);
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();
  } while (opt !== "0");
};
main();
