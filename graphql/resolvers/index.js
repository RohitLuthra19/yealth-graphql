const resolver = {
    Query: {
        getAllOrders: async (parent, args, { Order }) => {
            const orders = await Order.find();
            return orders.map((order) => {
                order._id = order._id.toString();
                return order;
            });
        },
        getOrder: async (parent, args, { Order }) => {
            const orders = await Order.findOne({ _id: orderId });
            return orders;
        },
    },
    Mutation: {
        placeOrder: async (parent, args, { Order }) => {
            const order = await new Order.save();
            order._id = order._id.toString();
            return order;
        }
    }
}
module.exports = resolver;