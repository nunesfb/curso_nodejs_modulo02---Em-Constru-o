import * as Yup from 'yup';

import Announcement from '../schemas/Announcement';

// carrego o modelo de dados

class AnnouncementController {
  // cria a funcao de tela de insert
  // nela executa a funcao de insert no banco de dados
  // os dados sao passados no corpo da requisicao via post
  async insert(req, res) {
    const schema = Yup.object().shape({
      topic: Yup.string()
        .required()
        .max(50)
        .uppercase(),
      description: Yup.string()
        .required()
        .max(255),
      validity: Yup.date().required(),
      image: Yup.string().required(),
      value: Yup.number().required(),
    });

    // aqui verifico se o schema anterior é valido, passando os dados do req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    req.body.idCompany = req.idCompany;

    const announcementData = await Announcement.create(req.body);

    return res.json(announcementData);
  }

  // SOMENTE ADMIN
  async index(req, res) {
    // body - corpo da requisicao
    // params - id definido na rota e outras info
    // query - parametros get (pego o parametro page que esta no get, posso definir valor default)
    const { page } = req.query;

    // depois posso usar o paginate
    // limite de 10 pagina e inicia na 1
    // https://www.npmjs.com/package/mongoose-paginate-v2
    const announcementData = await Announcement.paginate(
      {},
      // { page, limit: 5, sort: { name: 'desc' } }
      {
        page,
        limit: 5,
        sort: 'validity',
        select: {
          topic: 'topic',
          validity: 'validity',
        },
        populate: 'idCompany',
      }
    );

    return res.json(announcementData);
  }

  // SOMENTE ADMIN
  async details(req, res) {
    // a requisicao traz os parametros informados, sendo buscado o id (GET)
    const announcementData = await Announcement.findById(
      req.params.id_announcement
    ).populate('idCompany');

    const {
      topic,
      description,
      validity,
      image,
      value,
      idCompany: {
        cnpj,
        email,
        corporate_name,
        name,
        city,
        state,
        telephone: { commercial_phone },
      },
    } = announcementData;

    // return res.json(companyData.address);
    return res.json({
      topic,
      description,
      validity,
      image,
      value,
      cnpj,
      email,
      corporate_name,
      name,
      city,
      state,
      commercial_phone,
    });
  }

  async indexCompanyAnnouncement(req, res) {
    const announcement = await Announcement.find({
      idCompany: req.idCompany,
    }).select('topic validity');

    return res.json(announcement);
  }

  async detailsCompanyAnnouncement(req, res) {
    // a requisicao traz os parametros informados, sendo buscado o id (GET)
    const announcementData = await Announcement.findById(
      req.params.id_announcement
    );
    const { idCompany } = announcementData;

    if (idCompany.toString() !== req.idCompany) {
      return res.status(401).json({ error: 'This announcement is not yours!' });
    }

    // return res.json(companyData.address);
    return res.json(announcementData);
  }

  // cria a funcao de tela de update
  // nela executa a funcao de update no banco de dados em um registro especifico
  // os dados sao passados no corpo da requisicao via PUT e o id via parametro
  // o new true nos diz para atualizar o registro e guardar o registro atualizado na constante
  async updateAnnouncement(req, res) {
    const schema = Yup.object().shape({
      topic: Yup.string()
        .max(50)
        .uppercase(),
      description: Yup.string().max(255),
      validity: Yup.date(),
      image: Yup.string(),
      value: Yup.number(),
    });

    // aqui verifico se o schema anterior é valido, passando os dados do req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const announcement = await Announcement.findById(
      req.params.id_announcement
    );
    const { idCompany } = announcement;

    if (idCompany.toString() !== req.idCompany) {
      return res.status(401).json({ error: 'This announcement is not yours!' });
    }

    const announcementData = await Announcement.findByIdAndUpdate(
      req.params.id_announcement,
      req.body,
      { new: true }
    );
    return res.json(announcementData);
  }

  async deleteAnnouncement(req, res) {
    const announcement = await Announcement.findById(
      req.params.id_announcement
    );
    const { idCompany } = announcement;

    if (idCompany.toString() !== req.idCompany) {
      return res.status(401).json({ error: 'This announcement is not yours!' });
    }

    const announcementData = await Announcement.findByIdAndRemove(
      req.params.id_announcement
    );
    return res
      .status(201)
      .json({ message: `${announcementData.topic}: Delete OK!` });
  }
}

export default new AnnouncementController();
