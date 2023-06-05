const typeDefs = `#graphql

    scalar Upload
    scalar Date

    type Query {
        user: String,
        login (phone: String!, password: String!): operation!,
        getAllMultimedia (page: Int, limit: Int): [Multimedia],
        getAllCategory (input: InputGetCategory): [Category],
        getAllBrand (input: InputGetBrand): [Brand!]!,
        getAllSurvey (categoryId: ID!): [Survey!]!,
        getAllProductSpecs (categoryId: ID!): [Specs!]!,
        getAllProductSpecsDetails (specsId: ID!): [SpecsDetails!]!,
        getAllSeller (categoryId: ID!): [Seller!]!,
        getAllSlider: [Slider!]!,
        getProductInfo (input: InputGetProductInfo): ProductInfo!,
        getAllProduct (page: Int, limit: Int, productId: ID): [Product!]!
        getAllComment (input: InputGetComment): [Comment],
        getUsers (userId: ID): [User],
        getAllOrderStatus : [OrderStatus],
        getAllPayment (page: Int, limit: Int, orderId: ID): [Payment]
    }
    
    type Mutation {
        register (phone: String!, password: String!): operation!,
        multimedia (image: Upload!): operation!,
        category (name: String!, parent: ID, image: ID): operation!,
        brand (input: InputBrand): operation!,
        survey (input: InputSurvey): operation!,
        productSpecs (input: InputProductSpecs): operation!,
        productSpecsDetails (input: InputProductSpecsDetails): operation!,
        seller (input: InputSeller): operation!,
        slider (input: InputSlider): operation!,
        product (input: InputProduct): operation!,
        orderStatus (input: InputOrderStatus): operation!,
        comment (input: InputComment): operation!,
        addLike (commentId: ID!): operation!,
        addDisLike (commentId: ID!): operation!,
        favorite (productId: ID!): operation!,
        payment (input: InputPayment): operation!

        updateProductAttribute (input: InputUpdateProductAttribute): operation!,
        updateProductImages (productId:ID!, imagesId: [ID!]!): operation!,
        updateProduct (input: InputUpdateProduct): operation!,
        updateSlider (input: InputUpdateSlider): operation!,
        updateSeller (input: InputUpdateSeller): operation!,
        updateOrderStatus (input: InputUpdateOrderStatus): operation!,
        updatePayment (paymentId: ID!, orderStatusId: ID!): operation!
    }

    input InputBrand {
        name: String!,
        category: [ID!]!,
        image: Upload!
    }

    input InputSurvey {
        list: [SurveyItems!]!
    }

    input SurveyItems {
        name: String!,
        category: ID!
    }

    input InputProductSpecs {
        category: ID!,
        specs: String!,
        label: String
    }

    input InputProductSpecsDetails {
        specs: ID!,
        name: String!,
        label: String
    }

    input InputSeller {
        category: ID!,
        name: String!,
        label: String
    }

    input InputSlider {
        name: String!,
        images: [ID!]!,
        default: Boolean = false
    }

    input InputProduct {
        persianName: String!,
        englishName: String!,
        category: ID!,
        brand: ID!,
        attribute: [InputAttribute!]!,
        details: [InputDetails!]!,
        description: String,
        original: Upload
    }

    input InputAttribute {
        _id: ID,
        seller: ID!,
        color: String!,
        stock: Int!,
        price: Int!,
        discount: Int = 0,
    }

    input InputDetails {
        productSpecsDetails: ID!,
        value: String
    }

    input InputOrderStatus {
        name: String!,
        image: Upload,
        default: Boolean = false,
    }

    input InputComment {
        product: ID!,
        survey: [InputSurveyValue!]!,
        text: String!,
    }

    input InputSurveyValue {
        survey: ID!,
        value: Float = 3,
    }

    input InputPayment {
        products: [InputProductPayment!]!,
        count: Int = 1,
        discount: Int  = 0
    }

    input InputProductPayment {
        product: ID!,
        attribute: ID!
    }


    input InputUpdateProductAttribute {
        _id: ID,
        isAddSeller: Boolean = false,
        productId: ID,
        attribute: [InputAttribute!]!
    }

    input InputUpdateProduct {
        _id: ID!,
        persianName: String!,
        englishName: String!,
        brand: ID!,
        details: [InputUpdateDetails!]!,
        description: String,
        original: Upload
    }
    
    input InputUpdateDetails {
         _id: ID!,
         value: String
    }

    input InputUpdateSlider {
        sliderId: ID,
        name: String,
        images: [ID],
        default: Boolean
    }

    input InputUpdateSeller {
        sellerId: ID!,
        name: String,
        label: String
    }

    input InputUpdateOrderStatus {
        orderStatusId: ID!,
        name: String!,
        default: Boolean!
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

    input InputGetProductInfo {
        categoryId: ID,
        subCategoryId: ID,
        isSubCategory: Boolean = false
    }

    input InputGetComment {
        page: Int,
        limit: Int,
        productId: ID,
        commentId: ID
    }


    type operation {
        _id: ID,
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

    type Specs {
        _id: ID,
        specs: String,
        category: Category,
        label: String,
        details: [SpecsDetails]
    }

    type SpecsDetails {
        _id: ID,
        specs: Specs,
        name: String,
        label: String
    }

    type Seller {
        _id: ID,
        name: String,
        category: Category,
        label: String
    }

    type Slider {
        _id: ID,
        name: String,
        image: [Multimedia],
        default: Boolean
    }

    type ProductInfo {
        sellers: [Seller],
        brands: [Brand],
        subCategory: [Category],
        specs: [Specs], 
    }

    type Product {
        _id: ID,
        persianName: String!,
        englishName: String!,
        rate: Int,
        category: Category,
        brand: Brand,
        description: String,
        original: String,
        images: [Multimedia],
        attribute: [Attribute],
        details: [Details],
    }

    type Attribute {
        _id: ID,
        seller: Seller,
        color: String,
        stock: Int,
        price: Int,
        discount: Int,
    }

    type Details {
        _id: ID,
        productSpecsDetails: SpecsDetails,
        value: String
    }

    type Comment {
        _id: ID,
        user: User,
        product: ID,
        survey: [SurveyValue],
        text: String,
        like: [User],
        disLike: [User],
        createdAt: Date
    }

    type SurveyValue {
        survey: Survey,
        value: Float
    }

    type User {
        _id: ID,
        phone: String,
        fname: String,
        lname: String,
        address: String,
        favorite: [Favorite],
        comment: [Comment]
    }

    type Favorite {
        user: User,
        product: Product
    }

    type OrderStatus {
         _id: ID,
         name: String,
         image: String,
         default: Boolean
    }
    
    type Payment {
        _id: ID,
        user: User,
        products: [Product],
        attribute: [Attribute],
        orderStatus:  OrderStatus,
        paymentStatus: Boolean ,
        count: Int,
        price: Int,
        discount: Int,
        createdAt: Date,
    }

`;

module.exports = typeDefs;