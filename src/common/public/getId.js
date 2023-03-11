const getId = async (req, res, Schema, populates) => {
  try {
    const product = await Schema.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    await populates.forEach(item => {
      product.populate(item);
    })
    
    await product.execPopulate();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = getId;