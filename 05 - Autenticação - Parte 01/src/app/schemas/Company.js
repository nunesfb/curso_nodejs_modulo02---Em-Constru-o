import mongoose from 'mongoose';

const mongoosePaginate = require('mongoose-paginate-v2');

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
            required: true
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
        }
    },
    {
        timestamps: true,
        autoCreate: true,
    }
);

CompanySchema.plugin(mongoosePaginate);

export default mongoose.model('Company', CompanySchema, 'Company');