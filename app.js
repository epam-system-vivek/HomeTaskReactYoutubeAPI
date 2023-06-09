  const searchInput = document.querySelector('#search-input');
  const searchButton = document.querySelector('#search-button');
  const videosList = document.querySelector('#videos-list');
  let nextPageToken;
  let prevPageToken;

  async function fetchVideos(query, pageToken) {
    try {
      let url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyD69yDcPC-xKwVgBKOZ_lbeRxGr3RzmrhY&type=video&part=snippet&maxResults=8&q=${query}`;
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      renderVideos(data.items);
      nextPageToken = data.nextPageToken;
      prevPageToken = data.prevPageToken;
      renderButtons();
    } catch (error) {
      console.error(error);
    }
  }
  if(searchButton){
    searchButton.addEventListener('click', () => {
      const searchQuery = searchInput.value;
      fetchVideos(searchQuery);
    });
  }

  async function fetchVideos1(videoId, videoItem) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=AIzaSyD69yDcPC-xKwVgBKOZ_lbeRxGr3RzmrhY`);
    const data = await response.json();
    const vc = document.createElement('p');
    vc.textContent = `Views: ${data.items[0].statistics.viewCount}`;
    videoItem.appendChild(vc);
  }

  function renderVideos(videos) {
    videosList.innerHTML = '';
    videos.forEach((video) => {
      const videoItem = document.createElement('div');
      videoItem.classList.add('video-item');

      const thumbnail = document.createElement('img');
      thumbnail.src = video.snippet.thumbnails.medium.url;
      videoItem.appendChild(thumbnail);
      var linebreak = document.createElement("br");
      videoItem.appendChild(linebreak);

      const title = document.createElement('a');
      title.href = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      title.textContent = video.snippet.title;
      videoItem.appendChild(title);
      var linebreak = document.createElement("br");
      videoItem.appendChild(linebreak);

      const description = document.createElement('p');
      description.textContent = video.snippet.description;
      videoItem.appendChild(description);
      description.appendChild(document.createElement("br"));

      const author = document.createElement('p');
      author.textContent = `By Author: ${video.snippet.channelTitle}`;
      videoItem.appendChild(author);

      const publishedAt = document.createElement('p');
      publishedAt.textContent = `Published on ${new Date(video.snippet.publishedAt).toLocaleDateString()}`;
      videoItem.appendChild(publishedAt);

      const videoId = video.id.videoId;
      fetchVideos1(videoId, videoItem);

      videosList.appendChild(videoItem);
    });
  }




  function renderButtons() {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons-div');
    videosList.appendChild(buttonsDiv);

    if (prevPageToken) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.addEventListener('click', () => {
        fetchVideos(searchInput.value, prevPageToken);
      });
      buttonsDiv.appendChild(prevButton);
    }

    if (nextPageToken) {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.addEventListener('click', () => {
        fetchVideos(searchInput.value, nextPageToken);
      });
      buttonsDiv.appendChild(nextButton);
    }
  }

