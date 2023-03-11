const post = async (req, res, Schema , populates) => {
  try {
    const product = await Schema.create(req.body);
    
    populates.forEach(item => {
      product.populate(item);
    })

    await product.execPopulate();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = post;