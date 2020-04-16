import Mongoose from 'mongoose';

class Database {
    constructor(){
        this.init();
    }

    init(){
        this.mongoConnection = Mongoose.connect(
            'mongodb://localhost:27017/tech_announcement', {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true
            }
        )
    }
}

export default new Database();