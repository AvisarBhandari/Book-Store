import mongoose from 'mongoose'

const categorieSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, default: '' },
    }
    , { timestamps: true }
)
const Categorie = mongoose.model('Categorie', categorieSchema);
export default Categorie;