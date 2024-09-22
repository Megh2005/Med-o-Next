const Loader = ({ dimensions }: { dimensions: string }) => {
  return (
    <div
      className={`border-gray-300 animate-spin rounded-full border-2 border-t-primary ${dimensions}`}
    />
  );
};

export default Loader;
