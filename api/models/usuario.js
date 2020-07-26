const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: {type: String, required: true },
    codigo: {type: Number, required: true },
    senha: {type: String, required: true },
    curso: {type: String, required: true },
    cpf: {type: String, required: true },
    dtNascimento: {type: String, required: true },
    btAdm: {type: Boolean, default: 0},
    foto: {type: String, required: true}
});

module.exports = mongoose.model('Usuario', productSchema);