function notFound(req, res) {
  return res.status(404).json({ message: "Not Found" });
}

export default notFound;
