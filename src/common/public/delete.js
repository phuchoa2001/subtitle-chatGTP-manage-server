const deleteItem = async (req, res, Schema) => {
  try {
    const ids = req.query.ids;
    const result = await Schema.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (err) {
    console.error(err);
    res.statu
  }
}

module.exports = deleteItem;