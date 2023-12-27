const db = require("../models")
const { Op, Sequelize } = require("sequelize")
const account=require("../models/account")
class AccountConfig {
    constructor() {
        this.fieldMapping = Object.freeze(
            {
                id: "id",
                first_name: "first_name",
                last_name: "last_name",
                company_name: "company_name",
                address: "address",
                city: "city",
                country: "country",
                state: "state",
                zip: "zip",
                phone1: "phone1",
                phone2: "phone2",
                email: "email",
                web: "web"
            }
        )
        this.model = db.account
        this.modelName = db.account.name
        this.tableName = db.account.tableName

        this.filters = Object.freeze({
            // email: (email) => {
            //     validateStringLength(email, "email", undefined, 255)
            //     return Sequelize.where(Sequelize.fn("lower",
            //         Sequelize.col(this.columnMapping.email)),
            //         { [Op.eq]: `${email.toLowerCase()}` }
            //     )
            // },
        })
        this.associations = Object.freeze({
            accountFilter:'accountFilter',
        })
    }
}
const accountConfig = new AccountConfig()
// deepFreeze(userConfig)

module.exports = accountConfig