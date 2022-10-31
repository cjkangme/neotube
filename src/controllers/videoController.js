export const homeVideo = (req, res) => {
  const videos = [
    {
      title: 'Hello',
    },
    {
      title: 'Video #2',
    },
    {
      title: 'nice',
    },
  ];
  res.render('home', { pageTitle: 'Home', videos });
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
