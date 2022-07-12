import Box from "./Box";

export default function Column(props) {
  const { col, handleClick } = props;
  return (
    <div className="column" onClick={() => handleClick()}>
      {col.map((box, i) => (
        <Box occupiedBy={box} key={i} />
      ))}
    </div>
  );
}
