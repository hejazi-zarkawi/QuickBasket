import Order from "../../models/Order.js";


export const getAllOrdersForAllUsers = async(req,res) =>{
  try{

    const orders = await Order.find({ });

    if (!orders.length) {
      return res.status(200).json({
        success: false,
        message: "No orders found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  }
  catch(error){
    console.log("Error while fetching All Orders")
    return res.status(500).json({
      success: false,
      message: "Error while fetching orders",
    })
  }
}

export const getOrderDetailsForAdmin = async(req,res) =>{
  try{
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  }
  catch(error){
    console.log("Error while fetching Order Details")
    return res.status(500).json({
      success: false,
      message: "Error while fetching order details",
    })
  }
}

export const updateOrderStatus = async(req,res)=>{
  try{
    const {id} = req.params;
    const {orderStatus} = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndUpdate(id, {orderStatus})

    return res.status(200).json({
      success: true,
      message: "Order Status updated successfully!!!"
    })
  }
  catch(error){
    console.log("Error while updating the order status")
    return res.status(500).json({
      success: false,
      message: "Error while updating the order status",
    })
  }
}