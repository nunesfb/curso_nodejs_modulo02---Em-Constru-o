import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import Company from '../schemas/Company';
import authConfig from '../../config/auth';

class SessionController {
    async session(req, res) {
        const schema = Yup.object().shape({
            cnpj: Yup.number().required(),
            password_hash: Yup.string().required().max(8),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails!' });
        }

        const { cnpj, password_hash } = req.body;

        const company = await Company.findOne({
            cnpj,
        });

        if (!company) {
            return res.status(401).json({ error: 'Company not found!' });
        };

        const checkPassword = await bcrypt.compare(
            password_hash, company.password_hash
        );

        if (!checkPassword) {
            return res.status(401).json({ error: 'Password does not match!' });
        };

        const { id, name } = company;

        return res.json({
            id,
            name,
            cnpj
            ,
            token: jwt.sign({ id, cnpj }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        })
    }
}

export default new SessionController();
