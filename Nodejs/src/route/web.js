import express from "express";
import { getHomePage, getAboutPage, getCRUD, postCRUD,
    displayCRUD, getEditCRUD, putCRUD, deleteCRUD} from "../controllers/homeController";
    import userController from "../controllers/userController";
let router = express.Router();

let initWebRouters = (app) => {
    router.get('/', getHomePage);
    router.get('/about', getAboutPage);
    router.get('/crud', getCRUD);
    router.get('/get-crud', displayCRUD);
    router.get('/edit-crud', getEditCRUD);

    router.post('/post-crud', postCRUD);
    router.post('/put-crud', putCRUD);
    router.get('/delete-crud', deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    return app.use("/", router);
}

module.exports = initWebRouters;