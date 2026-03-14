const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nb_supp: { type: Number, default: 0 },  //li banahom
    nim: { type: Number, unique: true, required: true }, //numero carte nationale kima SINF
    isActive: { type: Boolean, default: true }, //online wela nn
    lastLogin: { type: Date },  //approche security
    loginAttempts: { type: Number, default: 0 }  //ida ktr men 5 y5erjo
}, { timestamps: true });   //bach y9dr y3rf ch7al men wa9t 3ml login

//lazem yethacha le mot de passe avant ma ydirlo save
AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model("admins", AdminSchema);