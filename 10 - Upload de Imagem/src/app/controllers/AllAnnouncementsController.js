import { subDays } from 'date-fns';

import Announcement from '../schemas/Announcement';

// carrego o modelo de dados

class AllAnnouncementController {
  async index(req, res) {
    const announcement = await Announcement.find({
      idCompany: { $ne: req.idCompany },
      validity: { $gt: subDays(new Date(), 1) },
    });

    return res.json(announcement);
  }
}

export default new AllAnnouncementController();
