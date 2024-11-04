const mongoose = require("mongoose")

const tareaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, "Debes establecer un título"],
        trim: true,
        maxlength: [20, "Límite de caracteres: 20"]
    },
    descripcion: {
        type: String,
        required: [true, "Debes añadir una descripción"]
    }
}, {timestamps:true}, {collection:"tareas"})

const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;