import bcrypt from 'bcryptjs';
import db from '../models/index';


let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if(isExist) {
                let user = await db.User.findOne({
                    where: {email: email},
                    attributes: ['email', 'roleId', 'password'],
                    raw: true

                })
                if(user) {
                   let check = await bcrypt.compareSync(password, user.password);
                //    let check = true;
                   if(check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user['password'];
                        userData.user = user;
                        
                   } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                   }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found~`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Pls try other email`;
            }
            resolve(userData);
        } catch(err) {
            reject(err);
        }
    });
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail},

            })
            if(user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch(err) {
            reject(err);
        }
    });
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let users = '';
            if(userId == 'ALL' ) {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
                
            } else if(userId) {
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            resolve(users);
      } catch(e) {
        console.log('error!!!!!!!!');
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin,
    getAllUsers
}