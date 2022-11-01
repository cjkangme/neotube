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

// Video Routers
export const watchVideo = (req, res) => {
  const { id } = req.params; //const id = req.params.id;
  const video = videos[id];
  if (video === undefined) {
    return res.send("Video doesn't exist");
  }
  return res.render('watch', {
    pageTitle: `Watching ${video.title}`,
    video: video,
  });
};

export const getEditVideo = (req, res) => {
  const id = req.params.id;
  const video = videos[id];
  return res.render('edit', {
    pageTitle: `Editing: ${video.title}`,
    video: video,
  });
};

export const postEditVideo = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id].title = title;
  return res.redirect(`/videos/${id}`);
};
