import { Router } from 'express';

const routes = new Router();

routes.get('/test', (req, res) => {
    return res.json({ message: 'OK!!!!!!'});
});

export default routes;