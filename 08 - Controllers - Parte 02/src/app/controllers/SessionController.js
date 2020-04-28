import jwt from 'jsonwebtoken';
// o Yup nao tem um export default, desta forma precisamos importar tudo com *
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import Company from '../schemas/Company';
import authConfig from '../../config/auth';

class SessionController {
  async session(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.number().required(),
      password_hash: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { cnpj, password_hash } = req.body;
    const company = await Company.findOne({
      cnpj,
    });

    if (!company) {
      return res.status(401).json({ error: 'Company not found!' });
    }

    const checkPassword = await bcrypt.compare(
      password_hash,
      company.password_hash
    );

    if (!checkPassword) {
      return res.status(401).json({ error: 'Password does not match!' });
    }
    // aqui pego o id e nome do usuario, o email ja tenho anteriormente
    const { id, name } = company;

    return res.json({
      // aqui retorno o id, nome e email, além do token
      company: {
        id,
        name,
        cnpj,
      },
      // aqui retorno o token
      // no sign passamos 3 parametros
      // o primeiro parametro é o que vai estar no payload, neste caso o id do usuario
      // assim tenho acesso ao id do usuario quando usar o token
      // no segundo parametro eu passo uma frase bem aleatoria, uma string que seja segura
      // gobarberrocketseat123 - gerou o hash
      // o terceiro parametro é o tempo de expiracao, neste caso ficou 7 dias
      token: jwt.sign({ id, cnpj }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
