describe('fetchVideos', () => {
  let fetchSpy;
  let renderVideosSpy;
  let renderButtonsSpy;

  beforeEach(() => {
    fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve({
        items: [],
        nextPageToken: 'next',
        prevPageToken: 'prev'
      })
    }));
    renderVideosSpy = spyOn(window, 'renderVideos');
    renderButtonsSpy = spyOn(window, 'renderButtons');
  });

  it('should call fetch with the correct URL', async () => {
    const query = 'test';
    const pageToken = 'testToken';
    await fetchVideos(query, pageToken);
    expect(fetchSpy).toHaveBeenCalledWith(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyD69yDcPC-xKwVgBKOZ_lbeRxGr3RzmrhY&type=video&part=snippet&maxResults=8&q=${query}&pageToken=${pageToken}`);
  });

  it('should call renderVideos with the fetched items', async () => {
    const items = [{id: {videoId: '1'}, snippet: {title: 'Test Video'}}];
    fetchSpy.and.returnValue(Promise.resolve({
      json: () => Promise.resolve({
        items,
        nextPageToken: 'next',
        prevPageToken: 'prev'
      })
    }));
    await fetchVideos('test');
    expect(renderVideosSpy).toHaveBeenCalledWith(items);
  });

  it('should set nextPageToken and prevPageToken based on the response', async () => {
    fetchSpy.and.returnValue(Promise.resolve({
      json: () => Promise.resolve({
        items: [],
        nextPageToken: 'next',
        prevPageToken: 'prev'
      })
    }));
    await fetchVideos('test');
    expect(nextPageToken).toEqual('next');
    expect(prevPageToken).toEqual('prev');
  });

  it('should call renderButtons after rendering videos', async () => {
    await fetchVideos('test');
    expect(renderButtonsSpy).toHaveBeenCalled();
  });

  it('should catch and log errors', async () => {
    const error = new Error('test error');
    fetchSpy.and.throwError(error);
    spyOn(console, 'error');
    await fetchVideos('test');
    expect(console.error).toHaveBeenCalledWith(error);
  });
});
describe('fetchVideos1', () => {
  it('should fetch video statistics and display the views count', async () => {
    // Mock fetch response
    const mockData = { items: [{ statistics: { viewCount: 100 } }] };
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({ json: () => Promise.resolve(mockData) })
    );

    const videoItem = document.createElement('div');
    await fetchVideos1('abc123', videoItem);
    expect(videoItem.querySelector('p').textContent).toContain('Views: 100');
  });

});
describe('fetchVideos function', () => {
  it('should fetch videos and render them on the page', async () => {
    // Set up test data
    const query = 'cats';
    const pageToken = '123';
    const fakeData = {
      items: [
        {
          id: {
            videoId: 'abc123'
          },
          snippet: {
            title: 'Cats are Awesome!',
            thumbnails: {
              medium: {
                url: 'https://fakeurl.com/cat.jpg'
              }
            },
            description: 'A video about cats',
            channelTitle: 'Cat Lovers',
            publishedAt: '2022-01-01T00:00:00.000Z'
          }
        }
      ],
      nextPageToken: '456',
      prevPageToken: '789'
    };

    // Spy on functions that the fetchVideos function calls
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve(fakeData)
    }));
    spyOn(window, 'renderVideos');
    spyOn(window, 'renderButtons');

    // Call the function being tested
    await fetchVideos(query, pageToken);

    // Check that the function calls were made correctly
    expect(fetch).toHaveBeenCalledWith(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyD69yDcPC-xKwVgBKOZ_lbeRxGr3RzmrhY&type=video&part=snippet&maxResults=8&q=${query}&pageToken=${pageToken}`);
    expect(renderVideos).toHaveBeenCalledWith(fakeData.items);
    expect(renderButtons).toHaveBeenCalled();
    expect(nextPageToken).toEqual('456');
    expect(prevPageToken).toEqual('789');
  });

  it('should handle errors when fetching videos', async () => {
    // Set up test data
    const query = 'dogs';

    // Spy on functions that the fetchVideos function calls
    spyOn(window, 'fetch').and.returnValue(Promise.reject('error'));
    spyOn(console, 'error');

    // Call the function being tested
    await fetchVideos(query);

    // Check that the function calls were made correctly
    expect(fetch).toHaveBeenCalledWith(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyD69yDcPC-xKwVgBKOZ_lbeRxGr3RzmrhY&type=video&part=snippet&maxResults=8&q=${query}`);
    expect(console.error).toHaveBeenCalledWith('error');
  });
});
describe('renderVideos', () => {
  let videosList;

  beforeEach(() => {
    videosList = document.createElement('div');
    videosList.id = 'videos-list';
    document.body.appendChild(videosList);
  });

  afterEach(() => {
    videosList.remove();
  });

  it('should render videos correctly', () => {
    const videos = [
      {
        id: {
          videoId: '123456'
        },
        snippet: {
          thumbnails: {
            medium: {
              url: 'https://example.com/thumbnail.jpg'
            }
          },
          title: 'Video Title',
          description: 'Video Description',
          channelTitle: 'Channel Title',
          publishedAt: '2022-01-01T00:00:00.000Z'
        }
      }
    ];

    renderVideos(videos);

    const videoItem = videosList.querySelector('.video-item');
    expect(videoItem).toBeTruthy();

    const thumbnail = videoItem.querySelector('img');
    expect(thumbnail.src).toBe('https://example.com/thumbnail.jpg');

    const title = videoItem.querySelector('a');
    expect(title.href).toBe('https://www.youtube.com/watch?v=123456');
    expect(title.textContent).toBe('Video Title');

    const description = videoItem.querySelector('p:nth-of-type(2)');
    expect(description.textContent).toBe('Video Description\n');
    expect(description.querySelector('br')).toBeTruthy();

    const author = videoItem.querySelector('p:nth-of-type(3)');
    expect(author.textContent).toBe('By Author: Channel Title');

    const publishedAt = videoItem.querySelector('p:nth-of-type(4)');
    expect(publishedAt.textContent).toBe('Published on 1/1/2022');

    const vc = videoItem.querySelector('p:last-of-type');
    expect(vc.textContent).toContain('Views:');
  });
});
