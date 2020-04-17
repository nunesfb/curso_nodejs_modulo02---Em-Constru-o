import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import adminMiddleware from './app/middlewares/admin';

import SessionController from './app/controllers/SessionController';

import CompanyController from './app/controllers/CompanyController';

const routes = new Router();


routes.post('/company', CompanyController.insert);

routes.post('/session', SessionController.session);

//middleware
routes.use(authMiddleware);

routes.get('/company', adminMiddleware, CompanyController.index);
routes.get('/company/:id_company', adminMiddleware, CompanyController.details);
routes.put('/company', CompanyController.updateCompany);
routes.put('/company/:id_company', adminMiddleware, CompanyController.updateCompanyStatus);

export default routes; 