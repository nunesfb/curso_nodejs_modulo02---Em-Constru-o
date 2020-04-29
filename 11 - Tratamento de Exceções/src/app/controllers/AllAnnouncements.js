import Announcement from '../schemas/Announcement';
import { subDays } from 'date-fns'

class AllAnnouncementController {
    //COMPANY
    async index(req, res) {
        const announcementData = await Announcement.find({
            idCompany: { $ne: req.idCompany},
            validity: { $gt: subDays(new Date(), 1)}, 
        });

        return res.json(announcementData);
    }
}

export default new AllAnnouncementController();
