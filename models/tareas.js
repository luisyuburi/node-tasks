const { formatRelative, subDays, format } = require("date-fns");
const { es } = require("date-fns/locale");

const inquirer = require("inquirer");

const Tarea = require("./tarea");

class Tareas {
  _listado = {};

  get listadoArr() {
    const listado = [];
    Object.keys(this._listado).forEach((key) => {
      const tarea = this._listado[key];
      listado.push(tarea);
    });
    return listado;
  }

  constructor() {
    this._listado = {};
  }

  borrarTarea(id = "") {
    if (this._listado[id]) {
      delete this._listado[id];
    }
  }

  cargarTareasFromArray(tareas = []) {
    tareas.forEach((tarea) => {
      this._listado[tarea.id] = tarea;
    });
  }

  listadoCompleto() {
    console.log();
    this.listadoArr.forEach((tarea, index) => {
      const idx = `${index + 1 + "."}`.green;
      const { desc, completadoEn } = tarea;
      const estado = completadoEn ? "Completada".green : "Pendiente".red;
      console.log(`${idx} ${desc} :: ${estado} `);
    });
  }

  listarPendientesCompletadas(completadas = true) {
    console.log();
    let contador = 0;
    this.listadoArr.forEach((tarea) => {
      const { desc, completadoEn } = tarea;
      const estado = completadoEn ? "Completada".green : "Pendiente".red;
      if (completadas) {
        // Mostrar completadas
        if (completadoEn) {
          contador += 1;
          console.log(
            `${(contador + ".").green} ${desc} :: ${completadoEn.green} `
          );
        }
      } else {
        // Mostrar pendientes
        if (!completadoEn) {
          contador += 1;
          console.log(`${(contador + ".").green} ${desc} :: ${estado} `);
        }
      }
    });
  }

  crearTarea(desc = "") {
    const tarea = new Tarea(desc);

    this._listado[tarea.id] = tarea;
  }

  toggleCompletadas(ids = []) {
    ids.forEach((id) => {
      const fecha = format(new Date(), "eeee dd/MM/yyyy", { locale: es });
      const hora = format(new Date(), "hh:mm a");
      const tarea = this._listado[id];
      if (!tarea.completadoEn) {
        tarea.completadoEn = `${
          fecha.charAt(0).toUpperCase() + fecha.slice(1)
        } a las ${hora}`;
      }
    });

    this.listadoArr.forEach((tarea) => {
      if (!ids.includes(tarea.id)) {
        this._listado[tarea.id].completadoEn = null;
      }
    });
  }
}

module.exports = Tareas;
