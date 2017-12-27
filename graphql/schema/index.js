//Defining Types
const typeDefs = `

enum AllowedUnits {
    0
    1
    2
}

enum AllowedOrderStatus {
    0
    1
    2
    3
    4
    5
}

type Address {
    name: String,
    houseNo: String,
    landMark: String,
    locality: String,
    pincode: String,
    mobileNumber: String,
    lat: String,
    long: String
}

type Medicine {
    medicineName: String,
    dosage: String,
    units: AllowedUnits,
    price: Number
}

type Order {
    id: ID!,
    orderNo: Number!,
    orderAddress: Address,
    orderBy: User,
    orderStatus: AllowedOrderStatus,
    prescription: [String],
    createdAt: Date,
    medicines: [Medicine],
    vendorAssigned: Vendor   
}

type Vendor {
    name: String,
    mobileNumber: String,
    createdAt: Date,
    address: Address,
    orderHistory: [Order],
}

type User {
    name: String,
    mobileNumber: String,
    createdAt: Date,
    email: String,
    address: [Address],
    orderHistory: [Order],
    orderId: Order,
    deviceToken: String,
    environment: String,
    osVersion: String,
    buildVersion: String,
    device: String,
    isSignupCompleted: Boolean
}

type Query {
    getAllOrders: [Order]
    getOrder(orderId: String!): Order
}

type Mutation {
    placeOrder(orderBy: String, orderStatus: Number, prescription: [String], createdAt: Date, vendorAssigned: String, medicines: Object, orderAddress: Object ): Order
}

schema {
    query: Query
    mutation: Mutation
}
`;

// Generate the schema object from types definition.
//module.exports = makeExecutableSchema({ typeDefs });
module.exports = typeDefs;