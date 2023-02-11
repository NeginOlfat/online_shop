const typeDefs = `#graphql

    type Query {
        user: String,
        login ( phone: String!, password: String! ): operation!
    }
    
    type Mutation {
        register ( phone: String!, password: String! ): operation!
    }

    type operation {
        status: Int,
        message: String,
        token: String
    }
`;

module.exports = typeDefs;