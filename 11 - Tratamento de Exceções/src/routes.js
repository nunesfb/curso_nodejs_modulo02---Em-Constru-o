import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer'; 

import authMiddleware from './app/middlewares/auth';

import adminMiddleware from './app/middlewares/admin';

import SessionController from './app/controllers/SessionController';

import CompanyController from './app/controllers/CompanyController';

import AnnouncementController from './app/controllers/AnnoucementController';

import AllAnnouncementController from './app/controllers/AllAnnouncements';

import AdminController from './app/controllers/AdminController';
 
const routes = new Router();

const upload = multer(multerConfig);

//COMPANY
routes.post('/company', CompanyController.insert);
//SESSION
routes.post('/session', SessionController.session);

//middleware
routes.use(authMiddleware);

//COMPANY
routes.put('/company', CompanyController.updateCompany);

//ANNOUNCEMENT
routes.post('/announcement', upload.single('image'), AnnouncementController.insert);
//ANNOUNCEMENT
routes.get('/announcement', AnnouncementController.indexCompanyAnnouncement);
//ANNOUNCEMENT
routes.get('/announcement/:id_announcement', AnnouncementController.detailsCompanyAnnouncement);
//ANNOUNCEMENT
routes.put('/announcement/:id_announcement', AnnouncementController.update);
//ANNOUNCEMENT
routes.delete('/announcement/:id_announcement', AnnouncementController.delete);

//ADMIN
routes.get('/announcementCompany', adminMiddleware, AdminController.indexAnnouncement);
//ADMIN
routes.get('/announcementCompany/:id_announcement', adminMiddleware, AdminController.detailsAnnouncement);
//ADMIN
routes.get('/company', adminMiddleware, AdminController.indexCompany);
//ADMIN
routes.get('/company/:id_company', adminMiddleware, AdminController.detailsCompany);
//ADMIN
routes.put('/company/:id_company', adminMiddleware, AdminController.updateCompanyStatus);

//ALL ANNOUNCEMENT
routes.get('/allAnnouncement', AllAnnouncementController.index);

export default routes; 