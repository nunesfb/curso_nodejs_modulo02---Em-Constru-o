import mongoose from 'mongoose';

// importa o mongoose paginate (paginacao)
const mongoosePaginate = require('mongoose-paginate-v2');

// aqui estou criando uma nova collection e passando seu schema (model)
const CompanySchema = new mongoose.Schema(
  {
    cnpj: {
      type: Number,
      required: true,
      unique: true,
    },
    corporate_name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
    },
    password_hash: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
        maxlength: 100,
      },
      zip_code: {
        type: Number,
        required: true,
      },
      city: {
        type: String,
        required: true,
        maxlength: 50,
      },
      state: {
        type: String,
        required: true,
        maxlength: 2,
      },
    },
    telephone: {
      commercial_phone: {
        type: Number,
        required: true,
      },
      cell_phone: {
        type: Number,
        required: true,
      },
    },
    admin: {
      type: Boolean,
      required: true,
      default: false,
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    // aqui estou dizendo que vai ter os campos created_at e updated_at
    timestamps: true,
    autoCreate: true,
  }
);

// adiciona o plugin para permitir paginacao
CompanySchema.plugin(mongoosePaginate);

// aqui passo o nome da collection e seu schema definido anteriormente
export default mongoose.model('Company', CompanySchema, 'Company');
