import ContentLoader from "react-content-loader";

const ResponsiveArticle = (props) => {
  return (
    <ContentLoader
      viewBox="0 0 1200 600"
      width={"100%"}
      speed={2}
      style={{ height: "100%" }}
      foregroundColor="#f0d8d8"
      backgroundColor="#f9e7e7"
      {...props}
    >
      <rect x="0" y="20" rx="5" ry="5" width="49%" height="10%" />
      <rect x="0" y="95" rx="5" ry="5" width="49%" height="10%" />
      <rect x="0" y="170" rx="5" ry="5" width="49%" height="10%" />
      <rect x="0" y="245" rx="5" ry="5" width="49%" height="10%" />
      <rect x="600" y="20" rx="5" ry="5" width="49%" height="10%" />
      <rect x="600" y="95" rx="5" ry="5" width="49%" height="10%" />
      <rect x="600" y="170" rx="5" ry="5" width="49%" height="10%" />
      <rect x="600" y="245" rx="5" ry="5" width="49%" height="10%" />
      <rect x="0" y="340" rx="5" ry="5" width="99%" height="40%" />
    </ContentLoader>
  );
};

export default ResponsiveArticle;
