import db from '../models'
import CRUDService from '../services/CRUDService'
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data);
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch(e) {
        console.log(e);
    }


};

let getAboutPage = (req, res) => {
    return res.render('./test/about.ejs');
};

let getCRUD =  (req, res) => {
    res.render('./crud.ejs');  
};

let postCRUD = async (req, res) => {
    console.log('post');
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('post crud from server');
};

let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let useId = req.query.id;
    if(useId) {
        let userData = await CRUDService.getUserInfoById(useId);
        res.render('editCRUD.ejs', {
            user: userData
        });
    } else {
        return res.send('Users not found');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    res.redirect("/get-crud");
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if(id) {
        await CRUDService.deleteUserById(id);
    }
    res.redirect("/get-crud");
}

module.exports = {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCRUD,
    displayCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
    
};