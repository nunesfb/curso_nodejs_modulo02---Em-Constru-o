import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/session', SessionController.session);

//middleware
routes.use(authMiddleware);

routes.get('/test', (req, res) => {
    return res.json({ idCompany: req.idCompany, cnpjCompany: req.cnpjCompany });
})

export default routes; 