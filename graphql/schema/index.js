//Defining Types
const typeDefs = `

input AddressInput {
    name: String
    houseNo: String
    landMark: String
    locality: String
    pincode: String
    mobileNumber: String
    lat: String
    long: String
}

input MedicineInput {
    _id: String
    medicineName: String
    dosage: String
    units: Int
    price: Int
}

input VendorInput {
    _id: String
    name: String
    mobileNumber: String
    createdAt: String
    address: AddressInput
    orderHistory: [OrderInput]
}

input UserInput {
    _id: String
    name: String
    mobileNumber: String
    createdAt: String
    email: String
    address: [AddressInput]
    orderHistory: [OrderInput]
    orderId: OrderInput
    deviceToken: String
    environment: String
    osVersion: String
    buildVersion: String
    device: String
    isSignupCompleted: Boolean
}

input OrderInput {
    _id: String
    orderNo: Int
    orderAddress: AddressInput
    orderBy: String
    orderStatus: Int
    prescription: [String]
    createdAt: String
    medicines: [MedicineInput]
    vendorAssigned: String  
}

type Address {
    _id: String
    name: String
    houseNo: String
    landMark: String
    locality: String
    pincode: String
    mobileNumber: String
    lat: String
    long: String
}

type Medicine {
    medicineName: String
    dosage: String
    units: Int
    price: Int
}

type Vendor {
    _id: String
    name: String
    mobileNumber: String
    createdAt: String
    address: Address
    orderHistory: [Order]
}

type User {
    _id: String
    name: String
    mobileNumber: String
    createdAt: String
    email: String
    address: [Address]
    orderHistory: [Order]
    orderId: Order
    deviceToken: String
    environment: String
    osVersion: String
    buildVersion: String
    device: String
    isSignupCompleted: Boolean
}

type Order {
    _id: String
    orderNo: Int
    orderAddress: Address
    orderBy: User
    orderStatus: Int
    prescription: [String]
    createdAt: String
    medicines: [Medicine]
    vendorAssigned: Vendor   
}

type Query {
    getAllOrders: [Order]
    getOrder(_id: String!): Order
    getOrdersByUser(userId:String!): Order


}

type Mutation {
    placeOrder(orderBy:String orderStatus:Int prescription:[String] createdAt:String vendorAssigned:String medicines:[MedicineInput] orderAddress:AddressInput ): Order
    updateOrder(_id: String! orderBy:String orderStatus:Int prescription:[String] createdAt:String vendorAssigned:String medicines:[MedicineInput] orderAddress:AddressInput ): Order
    removeOrder(_id: String!): Order
    updateOrderStatus(_id:String! orderStatus:Int): Order

    sendOtp(mobileNumber: String!): User
}

schema {
    query: Query
    mutation: Mutation
}
`;

// Generate the schema object from types definition.
//module.exports = makeExecutableSchema({ typeDefs });
module.exports = typeDefs;