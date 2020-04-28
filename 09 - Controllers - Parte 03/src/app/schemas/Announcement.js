import mongoose from 'mongoose';

// importa o mongoose paginate (paginacao)
const mongoosePaginate = require('mongoose-paginate-v2');

// aqui estou criando uma nova collection e passando seu schema (model)
const AnnouncementSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      maxlength: 50,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 255,
    },
    validity: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    idCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  {
    // aqui estou dizendo que vai ter os campos created_at e updated_at
    timestamps: true,
    autoCreate: true,
  }
);

// adiciona o plugin para permitir paginacao
AnnouncementSchema.plugin(mongoosePaginate);

// aqui passo o nome da collection e seu schema definido anteriormente
export default mongoose.model(
  'Announcement',
  AnnouncementSchema,
  'Announcement'
);
