export const homeVideo = (req, res) => {
  const videos = [
    {
      title: 'First Video',
      rating: 5,
      comments: 2,
      createdAt: '2 minuites ago',
      views: 59,
      id: 1,
    },
    {
      title: 'Second Video',
      rating: 5,
      comments: 2,
      createdAt: '2 minuites ago',
      views: 59,
      id: 1,
    },
    {
      title: 'Third Video',
      rating: 5,
      comments: 2,
      createdAt: '2 minuites ago',
      views: 59,
      id: 1,
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
