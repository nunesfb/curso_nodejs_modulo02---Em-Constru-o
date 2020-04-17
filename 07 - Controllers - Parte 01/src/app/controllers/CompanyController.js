import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

const mongoose = require('mongoose');

import Company from '../schemas/Company';

class CompanyController {
    async insert(req, res) {
        const schema = Yup.object().shape({
            cnpj: Yup.number().required(),
            corporate_name: Yup.string().required().max(100),
            name: Yup.string().required().max(100),
            email: Yup.string().required().max(100).email(),
            password_hash: Yup.string().required().max(8).min(6),
            address: Yup.object().shape({
                street: Yup.string().required().max(100),
                zip_code: Yup.number().required(),
                city: Yup.string().required().max(50),
                state: Yup.string().required().max(2),
            }),
            telephone: Yup.object().shape({
                commercial_phone: Yup.number().required(),
                cell_phone: Yup.number().required(),
            }),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails!' });
        };

        const { cnpj, password_hash } = req.body;

        const company = await Company.findOne({
            cnpj,
        });

        if (company) {
            return res.status(401).json({ error: 'Company already exists!' });
        };

        req.body.password_hash = await bcrypt.hash(password_hash, 8);

        const companyData = await Company.create(req.body);

        return res.json(companyData);
    }

    async index(req, res) {
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

    async details(req, res) {

        const companyData = await Company.findById(req.params.id_company).select(
            'cnpj corporate_name name email address telephone active'
        );

        if (!companyData) {
            return res.status(400).json({ error: 'Company not exists!' });
        }

        return res.json(companyData);
    }

    async updateCompany(req, res) {
        const schema = Yup.object().shape({
            cnpj: Yup.number(),
            corporate_name: Yup.string().max(100),
            name: Yup.string().max(100),
            email: Yup.string().max(100).email(),
            oldPassword: Yup.string().min(6).max(8),
            password_hash: Yup.string().max(8).min(6)
            .when('oldPassword', (oldPassword, field) => 
                oldPassword ? field.required() : field
            ),
            confirmPassword: Yup.string().max(8).min(6)
            .when('password_hash', (password_hash, field) => 
                password_hash ? field.required().oneOf([Yup.ref('password_hash')]) 
                : field
            ),
            address: Yup.object().shape({
                street: Yup.string().max(100),
                zip_code: Yup.number(),
                city: Yup.string().max(50),
                state: Yup.string().max(2),
            }),
            telephone: Yup.object().shape({
                commercial_phone: Yup.number(),
                cell_phone: Yup.number(),
            }),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails!' });
        };

        const { cnpj, password_hash, oldPassword } = req.body;

        const company = await Company.findById(req.idCompany);

        if (cnpj && cnpj !== company.cnpj) {
            const cnpjExists = await Company.findOne({
                cnpj,
            });

            if(cnpjExists) {
                return res.status(401).json({ error: 'Company already exists!'});
            }
        };

        const checkPassword = await bcrypt.compare(
            oldPassword,
            company.password_hash
        );

        if(!checkPassword){
            return res.status(401).json({ error: 'Password does not match!'});
        };

        req.body.password_hash = await bcrypt.hash(password_hash, 8);

        const companyData = await Company.findByIdAndUpdate(
            req.idCompany,
            req.body,
            {
                new: true
            }
        );

        return res.json(companyData);
    }

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
}

export default new CompanyController();