// /components/VideoCard.js
const VideoCard = ({ video, onClick }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={`http://localhost:5002/uploads/${video.filename}`}
        alt={video.filename}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{video.filename}</h3>
        <button
          onClick={() => onClick(video.filename)}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Play Video
        </button>
      </div>
    </div>
  );
  
  export default VideoCard;
  