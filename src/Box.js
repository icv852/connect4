export default function Box(props) {
  const { occupiedBy } = props;
  return (
    <div className="box">
      <div
        className="box_circle"
        style={{
          backgroundColor:
            occupiedBy === 0 ? "green" : occupiedBy === 1 ? "pink" : "white",
        }}
      ></div>
    </div>
  );
}
