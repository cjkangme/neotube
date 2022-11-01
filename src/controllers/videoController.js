let videos = [
  {
    title: 'First Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minuites ago',
    views: 59,
    id: 0,
  },
  {
    title: 'Second Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minuites ago',
    views: 1,
    id: 1,
  },
  {
    title: 'Third Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minuites ago',
    views: 59,
    id: 2,
  },
];

export const homeVideo = (req, res) => {
  res.render('home', { pageTitle: 'Home', videos: videos });
};

export const search = (req, res) => {
  res.send('Search');
};

// Video Routers
export const watchVideo = (req, res) => {
  const id = req.params.id; // const { id } = req.params
  const video = videos[id];
  if (video === undefined) {
    return res.send("Video doesn't exist");
  }
  return res.render('watch', {
    pageTitle: `Watching ${video.title}`,
    video: video,
  });
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
