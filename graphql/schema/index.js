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
    medicineName: String
    dosage: String
    units: Int
    price: Int
}

input VendorInput {
    name: String
    mobileNumber: String
    createdAt: String
    address: AddressInput
    orderHistory: [OrderInput]
}

input UserInput {
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
    orderNo: Int
    orderAddress: AddressInput
    orderBy: UserInput
    orderStatus: Int
    prescription: [String]
    createdAt: String
    medicines: [MedicineInput]
    vendorAssigned: VendorInput  
}

type Address {
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
    name: String
    mobileNumber: String
    createdAt: String
    address: Address
    orderHistory: [Order]
}

type User {
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
    getOrder(orderId: String!): Order
}

type Mutation {
    placeOrder(orderBy:String orderStatus:Int prescription:[String] createdAt:String vendorAssigned:String medicines:[MedicineInput] orderAddress:AddressInput ): Order
}

schema {
    query: Query
    mutation: Mutation
}
`;

// Generate the schema object from types definition.
//module.exports = makeExecutableSchema({ typeDefs });
module.exports = typeDefs;