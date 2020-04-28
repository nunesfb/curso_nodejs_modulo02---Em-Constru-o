import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

import Company from '../schemas/Company';

// carrego o modelo de dados

class CompanyController {
  // cria a funcao de tela de insert
  // nela executa a funcao de insert no banco de dados
  // os dados sao passados no corpo da requisicao via post
  async insert(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.number().required(),
      corporate_name: Yup.string()
        .required()
        .max(100),
      name: Yup.string()
        .required()
        .max(100),
      email: Yup.string()
        .required()
        .max(50) 
        .email(),
      password_hash: Yup.string()
        .required()
        .min(6)
        .max(8),
      address: Yup.object().shape({
        street: Yup.string()
          .required()
          .max(100),
        zip_code: Yup.number().required(),
        city: Yup.string()
          .required()
          .max(50),
        state: Yup.string()
          .required()
          .max(2),
      }),
      telephone: Yup.object().shape({
        commercial_phone: Yup.string()
          .required()
          .max(100),
        cell_phone: Yup.string()
          .required()
          .max(100),
      }),
    });

    // aqui verifico se o schema anterior é valido, passando os dados do req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { cnpj, password_hash } = req.body;
    const company = await Company.findOne({
      cnpj,
    });

    if (company) {
      return res.status(401).json({ error: 'Company already exists!' });
    }

    req.body.password_hash = await bcrypt.hash(password_hash, 8);

    const companyData = await Company.create(req.body);

    return res.json(companyData);
  }

  // cria a funcao de tela de update
  // nela executa a funcao de update no banco de dados em um registro especifico
  // os dados sao passados no corpo da requisicao via PUT e o id via parametro
  // o new true nos diz para atualizar o registro e guardar o registro atualizado na constante
  async updateCompany(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.number().required(),
      corporate_name: Yup.string().max(100),
      name: Yup.string().max(100),
      email: Yup.string()
        .max(50)
        .email(),
      oldPassword: Yup.string()
        .min(6)
        .max(8),
      password_hash: Yup.string()
        .min(6)
        .max(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when(
        'password_hash',
        (password_hash, field) =>
          password_hash
            ? field.required().oneOf([Yup.ref('password_hash')])
            : field
      ),
      address: Yup.object().shape({
        street: Yup.string().max(100),
        zip_code: Yup.number(),
        city: Yup.string().max(50),
        state: Yup.string().max(2),
      }),
      telephone: Yup.object().shape({
        commercial_phone: Yup.string().max(100),
        cell_phone: Yup.string().max(100),
      }),
    });

    // aqui verifico se o schema anterior é valido, passando os dados do req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { cnpj, password_hash, oldPassword } = req.body;

    const company = await Company.findById(req.idCompany);

    if (cnpj && cnpj !== company.cnpj) {
      const cnpjExists = await Company.findOne({
        cnpj,
      });

      if (cnpjExists) {
        return res.status(401).json({ error: 'Company already exists!' });
      }
    }

    const checkPassword = await bcrypt.compare(
      oldPassword,
      company.password_hash
    );

    if (!checkPassword) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    req.body.password_hash = await bcrypt.hash(password_hash, 8);

    const companyData = await Company.findByIdAndUpdate(
      req.idCompany,
      req.body,
      {
        new: true,
      }
    );
    return res.json(companyData);
  }
}

export default new CompanyController();
