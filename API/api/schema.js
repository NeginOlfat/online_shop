const typeDefs = `#graphql

    scalar Upload
    scalar Date

    type Query {
        user: String,
        login (phone: String!, password: String!): operation!,
        getAllMultimedia (page: Int, limit: Int): [Multimedia],
        getAllCategory (input: InputGetCategory): [Category],
        getAllBrand (input: InputGetBrand): [Brand!]!,
        getAllSurvey (categoryId: ID!): [Survey!]!
    }
    
    type Mutation {
        register (phone: String!, password: String!): operation!,
        multimedia (image: Upload!): operation!,
        category (name: String!, parent: ID, image: ID): operation!,
        brand (input: InputBrand): operation!,
        survey (input: InputSurvey): operation!
    }

    input InputBrand {
        name: String!,
        category: [ID!]!,
        image: Upload
    }

    input InputSurvey {
        list: [SurveyItems!]!
    }

    input SurveyItems {
        name: String!,
        category: ID!
    }

    input InputGetCategory {
        page: Int,
        limit: Int,
        mainCategory: Boolean,
        parentCategory: Boolean,
        catId: ID
    }

    input InputGetBrand {
        page: Int,
        limit: Int,
        category: ID,
        getAll: Boolean = true
    }

    type operation {
        status: Int,
        message: String,
        token: String
    }

    type Multimedia {
        _id: ID,
        name : String,
        dimWidth : String,
        dimHeight : String,
        dir: String,
        format: String,
        createdAt: Date,
    }

    type Category {
        _id: ID,
        name: String,
        parent: Parent,
        image: Multimedia
    }

    type Parent {
        _id: ID,
        name: String,
        parent: Category
    }

    type Brand {
        _id: ID,
        name: String,
        category: [Category],
        image: String
    }

    type Survey {
        _id: ID,
        name: String,
        category: Category,
    }

`;

module.exports = typeDefs;