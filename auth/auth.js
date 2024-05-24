require("dotenv").config()
const mongodb = require("mongodb")
const bcrypt = require("bcrypt")
const client = new mongodb.MongoClient(process.env.DB_URL)

const auth = (function(){
    const check_if_email_exist = async (email) => {
        // check if the email the user is trying to register with exists in the database
        const feedback = await client.db(process.env.DB_NAME).collection("users").findOne({email: email})
        if(feedback){
            return "exists"
        }else{
            return "not-exists"
        }
    }
    const create_user_account = async (firstname, lastname, email, password) => {
        let check_email = await check_if_email_exist(email)
        if(check_email == "not-exists"){
            //the email does not exist, proceed to hash the password...
            let password_hash = await bcrypt.hash(password, 10)
            if(password_hash){
                //password has been hashed, proceed to store in the database
                const data_to_be_inserted = {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password_hash,
                    is_user_logged_in: "false"
                }
                try{
                    const store_into_db = await client.db(process.env.DB_NAME).collection("users").insertOne(data_to_be_inserted)
                    if(store_into_db){
                        return {
                            message: "account successfully created",
                            code: "success",
                            data: {
                                firstname: firstname,
                                lastname: lastname,
                                email: email,
                                password: password_hash
                            }
                        }
                    }
                }catch(error){
                    return {
                        message: "unable to insert into database",
                        code: "error"
                    }
                }

            }
        }else{
            return {
                message: "user email exists already",
                code: "email-exists"
            }
        }
        

    }


    return {
        create_user_account: create_user_account,
        check_if_email_exist: check_if_email_exist
    }

    
}())

module.exports = auth