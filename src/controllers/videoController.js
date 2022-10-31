// Global Routers
const fakeUser = {
  username: 'faker',
  loggedIn: false,
};

export const homeVideo = (req, res) => {
  res.render('home', { pageTitle: 'Home', fakeUser: fakeUser });
};

export const search = (req, res) => {
  res.send('Search');
};

// Video Routers
export const watchVideo = (req, res) => {
  return res.render('watch', { pageTitle: 'Watch' });
};

export const editVideo = (req, res) => {
  return res.render('edit', { pageTitle: 'Edit' });
};

export const deleteVideo = (req, res) => {
  console.log(req.params);
  return res.send('Delete Video');
};

export const uploadVideo = (req, res) => {
  res.send('Upload Video');
};
