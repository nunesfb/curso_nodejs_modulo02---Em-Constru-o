import mongoose from 'mongoose';

const mongoosePaginate = require('mongoose-paginate-v2');

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
            required: true
        },
        idCompany: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
    },
    {
        timestamps: true,
        autoCreate: true,
    } 
);

AnnouncementSchema.plugin(mongoosePaginate);

export default mongoose.model('Announcement', AnnouncementSchema, 'Announcement');