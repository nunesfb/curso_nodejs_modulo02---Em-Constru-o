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
        timestamps: true,
        autoCreate: true,
        toObject: {
            getters: true,
            virtuals: true,
        },
        toJSON: {
            getters: true,
            virtuals: true,
        }
    } 
);

AnnouncementSchema.plugin(mongoosePaginate);

AnnouncementSchema.virtual('url_image').get(function() {
    return `${process.env.APP_URL}/announcement/${this.image}`;
})

export default mongoose.model('Announcement', AnnouncementSchema, 'Announcement');