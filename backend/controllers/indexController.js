const getHomeMessage = (req, res) => {
  res.send("RouteMind Backend Çalışıyor (Controller'dan Gelen Mesaj)");
};

module.exports = {
  getHomeMessage
};
