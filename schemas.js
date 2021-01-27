const Joi = require('joi').extend(require('@joi/date'));

const login_schema = Joi.object({
    Email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com','net']}}),

    Password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

const register_schema = Joi.object({
    UserFirstName: Joi.string()
    .min(2)
    .max(16)
    .required(),
    
    UserLastName: Joi.string()
    .min(2)
    .max(16)
    .required(),

    UserBirthDate: Joi.date(),

    UserMail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net']}}),

    Password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    UserPhoneNumber: Joi.string()
    .pattern(new RegExp('^[0-9]{11,11}$')),

    UserSex: Joi.number()
    .min(0)
    .max(1),

    CountyId: Joi.number()
    .min(0)
})

const update_pet_schema = Joi.object({
    PetId: Joi.number()
    .min(1)
    .required(),
    ShelterId: Joi.number()
    .min(1).required(),
    SpeciesId: Joi.number()
    .min(1).required(),
    PetName: Joi.string()
    .min(2).required(),
    PetWeight: Joi.number().required(),
    PetHeight: Joi.number().required(),
    PetAdditionInfo: Joi.string().required(),
    PetVaccineInfo: Joi.string().required(),
    PetBirthDate: Joi.date().required(),
    HasPassport: Joi.boolean().required(),
    PetGender: Joi.number().min(0).max(1).required(),
}).unknown(true)

const add_pet_schema = Joi.object({
    ShelterId: Joi.number()
    .min(1).required(),
    SpeciesId: Joi.number()
    .min(1).required(),
    PetName: Joi.string()
    .min(2).required(),
    PetWeight: Joi.number().required(),
    PetHeight: Joi.number().required(),
    PetAdditionInfo: Joi.string().required(),
    PetVaccineInfo: Joi.string().required(),
    PetGender: Joi.number().min(0).max(1).required(),
//    PetBirthDate: Joi.date().format('DD-MM-YYYY'),
    HasPassport: Joi.boolean().required()
}).unknown(true)

function verifyRegister(registerData){
    return register_schema.validate(registerData)
}

function verifyLogin(loginData){
    return login_schema.validate(loginData)
}

function verifyAddPet(petData) {
    return add_pet_schema.validate(petData)
}

function verifyUpdatePet(petData) {
    return update_pet_schema.validate(petData)
}

module.exports.verifyRegister = verifyRegister
module.exports.verifyLogin = verifyLogin
module.exports.verifyAddPet = verifyAddPet
module.exports.verifyUpdatePet = verifyUpdatePet

/*
    {
        UserFirstName: "gokay", 
        UserLastName: "Meric", 
        UserBirthDate: "11-11-2000", 
        UserMail: "admin@gmail.com", 
        Password: "Asdasd123", 
        UserPhoneNumber: "11111111111",
        UserSex : "1",
        UserLocation: "6"
    }

*/

