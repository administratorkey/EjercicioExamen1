import sqlite3 from 'sqlite3';
import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

/**
 * Creamos el conector con la base de datos "base-de-datos.db"
 * Este conector nos permitira "hablar" SQL con la base de datos.
 */
const db = new sqlite3.Database('./base-de-datos.db', (error) => {
    if (error) console.error(error)
    else console.log('Conectada con la base de datos.');
});

/**
 * El método .run del conector permite ejecutar SQL con la base de datos.
 * El string multilinea `` contiene las instrucciones para crear la
 * tabla "tareas" en caso de que esta no exista.
 * Dicha tabla tendrá un campo "id" numérico, un campo "descripcion" tipo
 * string y un campo "completada" booleano.
 */
db.run(`
    CREATE TABLE
        IF NOT EXISTS
        tareas(
            id INTEGER PRIMARY KEY,
            descripcion TEXT NOT NULL,
            completada BOOLEAN NOT NULL
        )
`);

/**
 * .all nos permite recibir un array de datos obtenidos de la
 * base de datos en base a la consulta SQL planteada.
 * Puede recibir uno o más argumentos. El primer argumento
 * es la consulta SQL y el último el callback que se ejecutará
 * una vez la base de datos nos entregue la respuesta.
 * El callback ha de recibir dos parámetros.
 *  - El primero recibiría un mensaje de error de la base de datos
 *    en el caso de que algo haya salido mal.
 *  - El segundo un array de objetos con los datos entregados por la
 *    base de datos si todo ha ido bien.
 */
app.get("/tarefa/", (peticion, respuesta)=>{
    if (peticion.query.id) {
        db.get( // Ejemplo de consulta para obter unha tarefa específica
            `SELECT id, descripcion, completada FROM tareas WHERE id = ?`,
            [peticion.query.id],
            (error, tarea) => {
                if (error) {
                    console.error(error)
                    respuesta.status(500)
                    respuesta.send(`Error accediendo a la base de datos.
                    Consulta la consola del backend para más información`)
                }
                else {
                    if (tarea) {
                        const JSONtarea = JSON.stringify(tarea)
                        respuesta.status(200)
                        respuesta.send(JSONtarea)
                    } else {
                        respuesta.status(404)
                        respuesta.send(`No se encontró la tarea con id ${peticion.query.id}`)
                    }

                }
            }
        )
    } else  {
        db.all( // Si no se especifica una tarea, se entregan todas
            `SELECT id, descripcion, completada FROM tareas`,
            (error, datos) => {
                if (error) {
                    console.error(error)
                    respuesta.status(500)
                    respuesta.send(`Error accediendo a la base de datos.
                    Consulta la consola del backend para más información`)
                }
                else {
                    const JSONdatos = JSON.stringify(datos)
                    respuesta.status(200)
                    respuesta.send(JSONdatos)
                }
            }
        )
    }
})

app.post("/tarefa/", (peticion, respuesta)=>{
    db.run( // Ejemplo de inserción en la base de datos
        `INSERT INTO tareas(id, descripcion, completada) VALUES (?, ?, ?)`,
        [peticion.body.id, peticion.body.descripcion, peticion.body.completada],
        (error) => {
            if (error) {
                console.error(error) 
                respuesta.status(500)
                respuesta.send(`Error accediendo a la base de datos.
                Consulta la consola del backend para más información`)
            } else {
                respuesta.status(200)
                respuesta.send("Ok")
            }
        }
    )
})

app.put("/tarefa/", (peticion, respuesta)=>{
    db.run(
        'UPDATE tareas SET descripcion = ?, completada = ? WHERE id = ?',
        [peticion.body.descripcion, peticion.body.completada, peticion.body.id],
        (error)=>{
            if (error) {
                console.error(error) 
                respuesta.status(500)
                respuesta.send(`Error accediendo a la base de datos.
                Consulta la consola del backend para más información`)
            } else {
                respuesta.status(200)
                respuesta.send("Ok")
            }
        }
    )
})

app.delete("/tarefa/", async (peticion, respuesta)=>{
    try {
      let sql;
      let params = [];
      if (peticion.body.id) {
        sql = 'DELETE FROM tareas WHERE id = ?';
        params.push(peticion.body.id);
      } else {
        sql = 'DELETE FROM tareas';
      }
      await db.run(sql, params);
      respuesta.status(200);
      respuesta.send({message: "Tarea o tareas eliminadas con exito."});
    } catch (error) {
      console.error(error);
      respuesta.status(500);
      respuesta.send({message: "Error accediendo a la base de datos. Consulta la consola del backend para más información"});
    }
  })
  

app.listen( 8000,()=>{
    console.log("Express traballando...");
})
