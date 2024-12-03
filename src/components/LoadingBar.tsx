import loadingBarGif from "../assets/loading-bar.gif";

export const LoadingBar = () => {
  return (
    <div className="loading-bar">
      <img src={loadingBarGif} alt="loading" />
    </div>
  );
};
