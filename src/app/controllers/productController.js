const Product = require("../models/Product");
const PAGE_SIZE = 8;

const productController = {
  addProduct: async (req, res) => {
    try {
      const newProduct = await new Product({
        name: req.body.name,
        description: req.body.description,
        rating: req.body.rating,
        category: req.body.category,
        images: req.body.images,
        price: req.body.price,
        originalPrice: req.body.originalPrice,
        sold: req.body.sold,
        view: req.body.view,
      });
      const product = await newProduct.save();
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllProducts: async (req, res) => {
    var page = req.query.page;
    try {
      if (page>0) {
        page = parseInt(page);
        if (page < 0) page = 0;
        var skips = (page - 1) * PAGE_SIZE;
        
        const allProducts = await Product.find();
        const totalPages = await Math.ceil(parseInt((allProducts.length)) / PAGE_SIZE);
        const products = await Product.find().skip(skips).limit(PAGE_SIZE);
       
        res.status(200).json({products,totalPages});
      } else {
        const products = await Product.find();
        res.status(200).json({products});
      }
    } catch (err) {
      res.status(401).json(err);
    }
  },
  searchProducts: async (req, res) => {
    var page = req.query.page;
    try {
      if (page) {
        page = parseInt(page);
        if (page < 0) page = 0;
        var skip = (page - 1) * PAGE_SIZE;
        const searchValue = await Product.find({
          name: { $regex: `.*${req.query.search}.*`, $options: "i" },
        })
          .skip(skip)
          .limit(PAGE_SIZE);
          const totalPages = await Math.ceil(parseInt((searchValue.length)) / PAGE_SIZE);
        res.status(200).json({searchValue, totalPages});
      } else {
        const searchValue = await Product.find({
          name: { $regex: `.*${req.query.search}.*`, $options: "i" },
        });
        res.status(200).json(searchValue);
      }
    } catch (err) {
      res.status(401).json(err);
    }
  },
  getCategory: async (req, res) => {
    var page = req.query.page;
    let query =""
    if( req.body.category ==='1' ){  query = "Phòng khách";}
    if( req.body.category =='2' ){  query = "Phòng ngủ";}
    if( req.body.category =='3' ){  query = "Phòng bếp";}
    // if( req.query.category ===4 ){  query = "Phòng ngủ";}
    // console.log(query)
    try {
      if (page) {
        page = parseInt(page);
        if (page < 0) page = 0;
        var skip = (page - 1) * PAGE_SIZE;
        const products = await Product.find({
          category:query
        })
          .skip(skip)
          .limit(PAGE_SIZE);
          const totalPages = await Math.ceil(parseInt((products.length)) / PAGE_SIZE);
        res.status(200).json({products, totalPages});
      } else {
        const produts = await Product.find({
          category:query,
        });
        res.status(200).json({products, totalPages});
      }
    } catch (err) {
      res.status(401).json(err);
    }

  },

  // Loc. Gia'
  getFilter: async (req, res) => {
    try {
      const min = req.query.min;
      const max = req.query.max;
      const category = req.query.category;

      const filterInput = {};
      if (category) {
        filterInput.category = category;
      }
      if (max && min) {
        filterInput.price = { $gte: min, $lte: max };
      } else if (max) {
        filterInput.price = { $lte: max };
      } else if (min) {
        filterInput.price = { $gte: min };
      }
      // const filter =await Product.find({
      //     price:{$gte:min,$lte:max},
      //     category:category
      const filter = await Product.find(filterInput);
      res.status(200).json(filter);
      // })
    } catch (err) {
      res.status(401).json(err);
    }
  },
  getProductId: async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId).lean();
      if (!product) {
        return res.status(401).json("Loi roi");
      } 
      
      else {
        await Product.updateOne(
          { _id: req.params.productId },
          { $inc: { view: 1 } }
        ).exec();
        const productsCategory = await Product.find({category:product.category});
        // return res.status(200).json(product);
        return res.status(200).json({product,productsCategory});
      }
    } catch (err) {
      return res.status(401).json(err);
    }
  },
  deleteForceProduct: async(req,res ) =>{
    try{
       await Product.deleteOne({ _id: req.params.id})
        return res.status(200).json("Deleted susssces");
    }
    catch(err){
        return res.status(401).json(err);
    }
  },
  deleteProduct: async(req,res ) =>{
    try{
        const deleted = await Product.delete({ _id:{$in: req.params.id}}).then()
        return res.status(200).json({success:true,status:"Deleted success !"});
    }
    catch(err){
        return res.status(401).json(err);
    }
  },
  updateProduct: async(req,res) =>{
    try{
        await Product.updateOne({ _id: req.params.id }, req.body)
        return res.status(200).json({success:true,status:"Edit success !"});
    }
    catch(err){
        return res.status(401).json(err);
    }
  },
  trashProducts: async(req,res) =>{
    try{
      const products = await Product.findDeleted();
      return res.status(200).json(products)
    }
    catch(err){
      return res.status(401).json(err);
    }
  },
  restoreProduct: async(req,res)=>{
    try{
      const products = await Product.restore({ _id: req.params.id });
      return res.status(200).json({success:true});
    }
    catch(err){
      return res.status(401).json(err);
    }
  }

  

};

module.exports = productController;
