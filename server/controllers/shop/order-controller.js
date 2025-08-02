import { client } from "../../helpers/paypal.js"
import paypal from "@paypal/checkout-server-sdk"
import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js"

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;



    const create_payment_json = {
      intent: "CAPTURE",
      payer: {
        payment_method: paymentMethod,
      },
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title,
            unit_amount: {
              currency_code: 'USD',
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
            sku: item.productId,
          })),
        },
      ],

      application_context: {
        return_url: `${CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
    };

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody(create_payment_json)

    const paypalClient = client();
    const order = await paypalClient.execute(request);


    const approvalURL = order.result.links.find(
      (link) => link.rel === 'approve'
    ).href;

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      approvalURL,
      orderId: newOrder._id,
    });

  }
  catch (error) {
    console.log(error)
    console.log("Error while creating Order")
    return res.status(500).json({
      success: false,
      message: "Error while creating Order",
    })
  }
}

export const capturePayment = async (req, res) => {
  try {
    const{tokenId, orderId, payerId} = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(tokenId);
    request.requestBody({});

    const paypalClient = client();
    const capture = await paypalClient.execute(request);

    if (capture.result.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    let order= await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    const paymentId = capture.result.purchase_units[0].payments.captures[0].id;

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;
    order.orderUpdateDate = new Date();

    for(let item of order.cartItems){
      let product = await Product.findById(item.productId)

      if(!product){
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${item.title}`
        })
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;

    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });

  }
  catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error while capturing Payment",
    })
  }
}

export const getAllOrdersByUser = async(req,res) =>{
  try{
    const { userId } = req.params;

    const orders = await Order.find({ userId });

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

export const getOrderDetails = async(req,res) =>{
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