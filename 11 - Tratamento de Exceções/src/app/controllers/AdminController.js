import Company from '../schemas/Company';
import Announcement from '../schemas/Announcement';

class AdminController {
    //ADMIN
    async indexCompany(req, res) {
        const { page = 1 } = req.query;

        const companyData = await Company.paginate(
            {},
            {
                page,
                limit: 5,
                sort: { name: 'asc' },
                select: 'cnpj name email telephone.commercial_phone',
            }
        )

        return res.json(companyData);
    }

    //ADMIN
    async detailsCompany(req, res) {

        const companyData = await Company.findById(req.params.id_company).select(
            'cnpj corporate_name name email address telephone active'
        );

        if (!companyData) {
            return res.status(400).json({ error: 'Company not exists!' });
        }

        return res.json(companyData);
    }

    //ADMIN
    async updateCompanyStatus(req, res) {

        const companyData = await Company.findByIdAndUpdate(
            req.params.id_company,
            req.body,
            {
                new: true,
            }
        )
            .select(
                'cnpj name email telephone.commercial_phone active'
            );

        if (!companyData) {
            return res.status(400).json({ error: 'Company not exists!' });
        }

        return res.json(companyData);
    }

    //ADMIN
    async indexAnnouncement(req, res) {
        const { page = 1 } = req.query;

        const announcementData = await Announcement.paginate(
            {},
            {
                page,
                limit: 5,
                sort: 'validity',
                select: {
                    topic: 'topic',
                    validity: 'validity'
                },
                populate: 'idCompany'
            }
        );

        return res.json(announcementData);
    }

    //ADMIN
    async detailsAnnouncement(req, res) {

        try {
            const announcementData = await Announcement.findById(
                req.params.id_announcement
            ).populate('idCompany');

            const {
                topic,
                description,
                validity,
                value,
                image,
                idCompany: {
                    cnpj,
                    email,
                    corporate_name,
                    name,
                    address: {
                        city,
                        state,
                    },
                    telephone: { commercial_phone }
                }
            } = announcementData;

            return res.json({
                topic,
                description,
                validity,
                value,
                image,
                cnpj,
                email,
                corporate_name,
                name,
                city,
                state,
                commercial_phone
            });
        }
        catch (err) {
            return res.status(400).json({
                message: `Ocorreu um erro (${err.message}). Por favor entre em contato com o administrador do sistema!`
            })
        }
    }
}

export default new AdminController();
