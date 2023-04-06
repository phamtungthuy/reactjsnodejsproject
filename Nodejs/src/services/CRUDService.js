import bcrypt from 'bcryptjs';
import db from '../models/index';


const saltRounds = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                  email: data.email,
                  password: hashPasswordFromBcrypt,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  address: data.address,
                  phonenumber: data.phonenumber,
                  gender: data.gender == 1 ? true : false,
                  image: null,
                  roleId: data.roleId,
                  positionId: null,
            })
            resolve('Successfully created a new user!');

        } catch(err) {
            reject(err);
        }
    });
   
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, saltRounds);
            resolve(hashPassword);
        } catch(err) {
            reject(err);
        }
    })
}

let getAllUser = async () =>{
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            });
            resolve(users);
        } catch(err) {
            reject(err);
        }
    })
}

let getUserInfoById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true
            })
            resolve(user || []);
        } catch(err) {
            reject(err);
        }
    });
}

let updateUserData = async (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: {id: data.id}
            });
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else {
                resolve('Nothing to update!');
            }
        } catch(err) {
            reject(err);
        }
    });
}

let deleteUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: {id: userId},
                raw: false
            });
            if(user) {
                console.log(user)
                await user.destroy();
            }
            resolve('Successfully deleted');
        } catch(err) {
            reject(err);
        }
    });
}

module.exports = {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUserData,
    deleteUserById

};