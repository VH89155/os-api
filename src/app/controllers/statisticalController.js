const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const Bluebird = require("bluebird");

const getStatiscalAdmin = async (req, res, next) => {
  try {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    console.log(year);
    const orderItem = await OrderItem.aggregate([
      {
        $project: {
          createdAt: { $month: "$createdAt" },
          createdAtYear: { $year: "$createdAt" },
          document: "$$ROOT",
        },
      },
    ]);

    /*-------------------------------month--------------------------------------------------*/
    const orderItemMonth = orderItem.filter(
      (item) => item.createdAt.toString() === month.toString()
    );
    const orderItemLastMonth = orderItem.filter(
      (item) => item.createdAt.toString() === (month - 1).toString()
    );
    //   console.log(orderItemMonth);
    const sumWithInitial = orderItem.reduce((currentValue, item) => {
      return item.document.quantity * item.document.price + currentValue;
    }, 0);

    const sumWithInitialMonth = orderItemMonth.reduce((currentValue, item) => {
      return item.document.quantity * item.document.price + currentValue;
    }, 0);

    const sumWithInitialLastMonth = orderItemLastMonth.reduce(
      (currentValue, item) => {
        return item.document.quantity * item.document.price + currentValue;
      },
      0
    );
    let growth = 0;
    if (
      sumWithInitialMonth &&
      sumWithInitialLastMonth &&
      sumWithInitialLastMonth != 0
    ) {
      growth = Math.round(
        (sumWithInitialMonth / sumWithInitialLastMonth - 1) * 100
      );
    }
    if (!sumWithInitialLastMonth && sumWithInitialMonth) {
      growth = 100;
    }
    /*-------------------------------month--------------------------------------------------*/

    /*-------------------------------Year--------------------------------------------------*/
    const orderItemYear = orderItem.filter(
      (item) => item.createdAtYear.toString() === year.toString()
    );

    const orderItemLastYear = orderItem.filter(
      (item) => item.createdAtYear.toString() === (year - 1).toString()
    );

    const sumWithInitialYear = orderItemYear.reduce((currentValue, item) => {
      return item.document.quantity * item.document.price + currentValue;
    }, 0);

    const sumWithInitialLastYear = orderItemLastYear.reduce(
      (currentValue, item) => {
        return item.document.quantity * item.document.price + currentValue;
      },
      0
    );

    const listGains = await Bluebird.map(
      orderItemYear,
      async (item) => {
        const product = await Product.findById({
          _id: item.document.product,
        }).select("originalPrice");
        return { ...item, product };
      },
      { concurrency: orderItemYear.length }
    );

    const listLastGains = await Bluebird.map(
      orderItemLastYear,
      async (item) => {
        const product = await Product.findById({
          _id: item.document.product,
        }).select("originalPrice");
        return { ...item, product };
      },
      { concurrency: orderItemYear.length }
    );

    const totalGains = listGains.reduce((currentValue, item) => {
      return (
        item.document.quantity * item.document.price -
        item.document.quantity * item.product.originalPrice +
        currentValue
      );
    }, 0);

    const totalLastGains = listLastGains.reduce((currentValue, item) => {
      return (
        item.document.quantity * item.document.price -
        item.document.quantity * item.product.originalPrice +
        currentValue
      );
    }, 0);

    let growthGain = 0;
    if (totalGains && totalLastGains) {
      growthGain = Math.round((totalGains / totalLastGains - 1) * 100);
    }
    if (!totalLastGains && totalGains) {
      growthGain = 100;
    }
    console.log("growthGain ", growthGain);
    console.log("totalLastGains ", totalLastGains);

    let growthYear = 0;
    if (
      sumWithInitialYear &&
      sumWithInitialLastYear &&
      sumWithInitialLastYear != 0
    ) {
      growthYear = Math.round(
        (sumWithInitialYear / sumWithInitialLastYear - 1) * 100
      );
    }
    if (!sumWithInitialLastYear && sumWithInitialYear) {
      growthYear = 100;
    }

    console.log("sumWithInitialLastYear", sumWithInitialLastYear);
    console.log(growthYear);

    const statisTotal = {
      total: sumWithInitial,
      gains: {
        growthGain: growthGain,
        totalGainsYear: totalGains,
        totalGainsLastYear: totalLastGains,
      },
      totalMonth: {
        month: sumWithInitialMonth,
        lastMonth: sumWithInitialLastMonth,
        growth: growth,
      },
      totalYear: {
        year: sumWithInitialYear,
        lastYear: sumWithInitialLastYear,
        growthYear: growthYear,
      },
    };

    res.status(200).json({ success: true, statisTotal });
  } catch (err) {
    next(err);
  }
};

const getStatiscalMonth = async (req, res, next) => {
  const year = new Date().getFullYear();
  // console.log(year)
  const orderItem = await OrderItem.aggregate([
    {
      $project: {
        createdAt: { $month: "$createdAt" },
        createdAtYear: { $year: "$createdAt" },
        document: "$$ROOT",
      },
    },
  ]);

  const orderItemYear = orderItem.filter(
    (item) => item.createdAtYear.toString() === year.toString()
  );

  // console.log(orderItemYear);
  let monthlyRevenue = [];
  const month = [
    {
      id: 1,
      month: "Jan",
    },
    {
      id: 2,
      month: "Feb",
    },
    {
      id: 3,
      month: "Mar",
    },
    {
      id: 4,
      month: "Apr",
    },
    {
      id: 5,
      month: "May",
    },
    {
      id: 6,
      month: "Jun",
    },
    {
      id: 7,
      month: "Jul",
    },
    {
      id: 8,
      month: "Aug",
    },
    {
      id: 9,
      month: "Sep",
    },
    {
      id: 10,
      month: "Oct",
    },
    {
      id: 11,
      month: "Now",
    },
    {
      id: 12,
      month: "Dec",
    },
  ];

  monthlyRevenue = await Bluebird.map(month, async (item) => {
    let sum = 0;

    sum = orderItemYear
      .filter((vItem) => {
        return vItem.createdAt.toString() === item.id.toString();
      })
      .reduce((currentValue, sItem) => {
        return sItem.document.quantity * sItem.document.price + currentValue;
      }, 0);

    return { month: item, sum };
  });

  res.status(200).json( monthlyRevenue );
};

const getCategoryByProduct = async (req, res, next) => {
  try {
    const categoryProduct = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          sold: { $sum: "$sold" },
        },
      },
    ]);
    return res.status(200).json({ categoryProduct });
  } catch (err) {
    next(err);
  }
};
const getOrderItemSucccess = async (req, res, next) => {
    try{
        const OrderSuccess = await Order.aggregate([{

            $match : { 
                status : true ,
                cancel: false
            
            } ,
          
        },{
            $lookup:{
                from: "orderitems",
                localField: "_id",
                foreignField: "order",
                as: "orderItem",
            },
        },{
            $project:{
                 "orderItem" :1
            }
        }])
        // const Success  = await ProductOrder.filter((item)=> item.status === true && item.cancel ===false)
        
        const orderItems = await OrderSuccess.map((item)=>{
            const {orderItem, ...tem} =item;
            return orderItem
        })
        let OrderItemLast = []
        await orderItems.forEach((item)=> OrderItemLast =OrderItemLast.concat(item))
        return OrderItemLast;
    }
    catch (err){
        return err
    }
}

const getProductOrder = async (req, res, next) => {
  try {
    const ProductOrderSuccess = await getOrderItemSucccess(req, res,next)
    let arr=[]
    const numberProduct = await Bluebird.map(
        ProductOrderSuccess,
        async (item) => {
          // let sum = 0;
        if(arr.includes(item.product.toString()))  {
            console.log(arr)
            return 0
        }                   
        else{         
         arr.push(item.product.toString())
         console.log(arr)
         const product = await Product.findById(item.product)
         console.log(product)
          const totalNumber = await ProductOrderSuccess
            .filter((VItem) => {
              return item.product.toString() === VItem.product.toString();
            })
            .reduce((currentValue, sItem) => {
              // const product = await Product.findById(sItem._id)
              // sum += sItem.quantity
              return currentValue + sItem.quantity;
            }, 0);
        //   console.log({item, totalNumber})  
          return { product: item.product,name:product.name, quantity: totalNumber };
        }
        },
        { concurrency: ProductOrderSuccess.length }
      );
    res.status(200).json(numberProduct)
  } catch (err) {
    next(err);
  }
};






const getCategoryByOrder = async (req, res, next) => {
  try {
    const categorys = ["Phòng bếp", "Phòng ngủ", "Phòng khách"];
    const ProductOrderSuccess = await getOrderItemSucccess(req, res,next)
    let arr=[]
    const ProductOrder = await Bluebird.map(
        ProductOrderSuccess,
        async (item) => {
          // let sum = 0;
        if(arr.includes(item.product.toString()))  {
            console.log(arr)
            return 0
        }                   
        else{         
         arr.push(item.product.toString())
         console.log(arr)
          const totalNumber = await ProductOrderSuccess
            .filter((VItem) => {
              return item.product.toString() === VItem.product.toString();
            })
            .reduce((currentValue, sItem) => {
              // const product = await Product.findById(sItem._id)
              // sum += sItem.quantity
              return currentValue + sItem.quantity;
            }, 0);
        //   console.log({item, totalNumber})  
          return { product: item.product, quantity: totalNumber };
        }
        },
        { concurrency: ProductOrderSuccess.length }
      );


    const product = await Bluebird.map(ProductOrder, async (item) => {
        const product1 =await Product.findById(item.product)
        return{ category:product1?.category,quantity: item.quantity}
      
    },{ concurrency: ProductOrder.length });
    
    const numberCategory = await Bluebird.map(
      categorys,
      async (item) => {
        // let sum = 0;
        
        const totalNumber = await product
          .filter((VItem) => {
            return item === VItem.category;
          })
          .reduce((currentValue, sItem) => {
            // const product = await Product.findById(sItem._id)
            // sum += sItem.quantity
            return currentValue + sItem.quantity;
          }, 0);
        console.log({item, totalNumber})  
        return { category: item, sum: totalNumber };
      },
      { concurrency: categorys.length }
    );
    res.status(200).json( numberCategory );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStatiscalAdmin,
  // getTopUser,
  getStatiscalMonth,
  getCategoryByProduct,
  getCategoryByOrder,
  getProductOrder,
  // getStatiscalUser,
};
