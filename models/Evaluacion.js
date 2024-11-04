const mongoose = require("mongoose")

const evaluacionSchema = new mongoose.Schema({
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
}, 
{timestamps:true},
{collection:"evaluaciones"})

const Evaluacion = mongoose.model('Evaluación', evaluacionSchema);

module.exports = Evaluacion;