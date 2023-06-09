import bcrypt from 'bcryptjs';
import db from '../models/index';


const saltRounds = bcrypt.genSaltSync(10);


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

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exists?
            let check = await checkUserEmail(data.email);
            if(check === true) {
                console.log('asdasdasdasd');
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in use, Plz try another email'
                })
                return;
            }
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
            resolve({
                errCode: 0,
                message: 'OK'
            });
        } catch(e) {
            reject(e);
        }
    });
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: {id: userId}
        });
        if(!user) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }
        await db.User.destroy({
            where: {id: userId}
        });

        resolve({
            errCode: 0,
            errMessage: `The user has been deleted`
        })
    });
}

let updateUserData = async (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            if(!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameters`
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            });
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                // await db.User.save({
                    
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address
                // }, {
                //     where: {id: data.id}
                // });
                    
                resolve({
                    errCode: 0,
                    message: 'Update successfully!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                });
            }
        } catch(err){
            reject(err);
        }
    })
}

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData

}