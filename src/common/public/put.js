const put = async (req, res, Schema , populates) => {
  console.log(req.params.id);
  try {
    const product = await Schema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    populates.forEach(item => {
      product.populate(item);
    })

    await product.execPopulate();
    res.json(product);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = put;