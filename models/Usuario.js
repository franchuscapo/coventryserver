const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Debes establecer un nombre"],
        trim: true,
        maxlength: [20, "Límite de caracteres: 20"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Debes establecer una contraseña"],
        trim: true,
        minlength: [6, "Mínimo de caracteres: 6"]
    },
    nombre: {
        type: String,
        required: [true, "Debes añadir un nombre"]
    },
    apellido: {
        type: String,
        required: [true, "Debes añadir un Apellido"]
    },
    admin: {
        type: Boolean,
        default: false
    }
}, { collection: "usuarios" })

usuarioSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id,username: this.username }, process.env.JWT_SECRET,{expiresIn: process.env.JWT_LIFETIME})
}

usuarioSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;