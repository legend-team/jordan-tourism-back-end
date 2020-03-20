'use strict ';


/**
 * a class Model that has the CRUD features
 */
class Model {
    constructor(schema) {
        this.schema = schema
    }
    get(_id) {
        if (_id) {
            return this.schema.find({ _id })
        }
        else {
            return this.schema.findOne()
        }
    }
    create(input) {
        let output = new this.schema(input)
        return output.save()

    }
    update(_id, record) {
        let output = this.schema.findByIdAndUpdate(_id, record, { new: true })
        return output
    }
    delete(_id) {
        return this.schema.findByIdAndDelete(_id)
    }
}

module.exports = Model