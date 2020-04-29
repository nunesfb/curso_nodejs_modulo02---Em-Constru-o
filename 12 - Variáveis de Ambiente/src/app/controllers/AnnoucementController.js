import * as Yup from 'yup';

import Announcement from '../schemas/Announcement';

class AnnouncementController {
    //COMPANY
    async insert(req, res) {
        const schema = Yup.object().shape({
            topic: Yup.string().required().max(50).uppercase(),
            description: Yup.string().required().max(255),
            validity: Yup.date().required(),
            value: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails!' });
        };

        req.body.idCompany = req.idCompany;

        const { filename: announcement_image } = req.file;
        req.body.image = announcement_image;

        const announcementData = await Announcement.create(req.body);

        return res.json(announcementData);
    }

    //COMPANY
    async indexCompanyAnnouncement(req, res) {
        const announcementData = await Announcement.find({
            idCompany: req.idCompany
        }).select('topic validity');

        return res.json(announcementData);
    }

    //COMPANY
    async detailsCompanyAnnouncement(req, res) {
        const announcementData = await Announcement.findById(
            req.params.id_announcement
        );
        const { idCompany } = announcementData;

        if (idCompany.toString() !== req.idCompany) {
            return res.status(401).json({ error: 'This announcement is not yours!' });
        }

        return res.json(announcementData);
    }

    //COMPANY
    async update(req, res) {
        const schema = Yup.object().shape({
            topic: Yup.string().max(50).uppercase(),
            description: Yup.string().max(255),
            validity: Yup.date(),
            image: Yup.string(),
            value: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails!' });
        };

       const announcement = await Announcement.findById(
           req.params.id_announcement
       );

       const { idCompany } = announcement;

       if(idCompany.toString() !== req.idCompany){
        return res.status(401).json({ error: 'This announcement is not yours!' });
       };

       const announcementData = await Announcement.findByIdAndUpdate(
           req.params.id_announcement,
           req.body,
           { new: true }           
       );

        return res.json(announcementData);
    }

    //COMPANY
    async delete(req, res) {
        const announcement = await Announcement.findById(
            req.params.id_announcement
        );

        const { idCompany } = announcement;

        if(idCompany.toString() !== req.idCompany){
         return res.status(401).json({ error: 'This announcement is not yours!' });
        };

        const announcementData = await Announcement.findByIdAndRemove(
            req.params.id_announcement
        );

        return res. status(201).json({ message: `${announcement.topic}: Delete OK!`});
    }


}

export default new AnnouncementController();