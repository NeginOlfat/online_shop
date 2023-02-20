const typeDefs = `#graphql

    scalar Upload
    scalar Date

    type Query {
        user: String,
        login (phone: String!, password: String!): operation!,
        getAllMultimedia (page: Int, limit: Int): [Multimedia],
        getAllCategory (input: InputCategory): [Category],
    }
    
    type Mutation {
        register (phone: String!, password: String!): operation!,
        multimedia (image: Upload!): operation!,
        category (name: String!, parent: ID, image: ID): operation!
    }

    input InputCategory{
        page: Int,
        limit: Int,
        mainCategory: Boolean,
        parentCategory: Boolean,
        catId: ID
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
`;

module.exports = typeDefs;