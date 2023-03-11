const increaseView = async (req, res, Schema) => {
  try {
    const { id } = req.params;
    const result = await Schema.findByIdAndUpdate(id, { $inc: { view: 1 } }, { new: true });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}