import ContentLoader from "react-content-loader";

const ResponsiveArticle = (props) => {
  return (
    <ContentLoader
      viewBox="0 0 700 500"
      width={"100%"}
      speed={2}
      style={{ height: "100%" }}
      foregroundColor="#f0d8d8"
      backgroundColor="#f9e7e7"
      {...props}
    >
      <rect x="0" y="0" rx="5" ry="5" width="45%" height="45%" />
      <rect x="350" y="0" rx="5" ry="5" width="45%" height="45%" />
      <rect x="0" y="250" rx="5" ry="5" width="45%" height="45%" />
      <rect x="350" y="250" rx="5" ry="5" width="45%" height="45%" />
    </ContentLoader>
  );
};

export default ResponsiveArticle;
