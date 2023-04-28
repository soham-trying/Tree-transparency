import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const apiKey = 'tdEaX8DYsXizI6dNvU0wKThVu7djpfn4';
  const gifId = '';
  const url = `https://api.giphy.com/v1/gifs/${gifId}?api_key=${apiKey}`;

  const [gifUrl, setGifUrl] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setGifUrl(data.data.images.original.url))
      .catch(error => console.error(error));
  }, [url]);

  return (
    <div>
      {gifUrl ? (
        <Image src={gifUrl} alt="GIF" width={200} height={200} />
      ) : (
        <p>Loading...</p>
        
      )}
      <iframe src="https://giphy.com/embed/MBs9M9YaCGsbVPat6O" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/IntoAction-covid-arbor-day-plant-a-tree-MBs9M9YaCGsbVPat6O">via GIPHY</a></p>
    </div>
  );
}