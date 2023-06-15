import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const cross = (
  <svg
    className="w-10 h-10"
    viewBox="0 0 16 16"
    fill="currentColor"
    height="1em"
    width="1em"
    id={1}
  >
    <path
      fill="currentColor"
      d="M15.854 12.854L11 8l4.854-4.854a.503.503 0 000-.707L13.561.146a.499.499 0 00-.707 0L8 5 3.146.146a.5.5 0 00-.707 0L.146 2.439a.499.499 0 000 .707L5 8 .146 12.854a.5.5 0 000 .707l2.293 2.293a.499.499 0 00.707 0L8 11l4.854 4.854a.5.5 0 00.707 0l2.293-2.293a.499.499 0 000-.707z"
    />
  </svg>
);
const circle = (
  <svg
    className="w-10 h-10"
    viewBox="0 0 512 512"
    fill="currentColor"
    height="1em"
    width="1em"
  >
    <path d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256zM256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z" />
  </svg>
);
const figures = {
  circle,
  cross,
};

const TriLine = ({ sendMessage, lastMessage }) => {
  const [figure, setFigure] = useState(figures.cross);
  const [isOver, setIsOver] = useState(false);
  const [data, setData] = useState([]);
  const [gameTemplate, setGameTemplate] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  // sk

  const handleSelect = (e) => {
    const id = parseInt(e.currentTarget.getAttribute("data-id"));
    sendMessage(id);
  };

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.data) {
        console.log(lastMessage.data);
        const data_json = JSON.parse(lastMessage.data);
        setData(data_json);
        setIsOver(data_json.is_over);
        data_json.game_template && setGameTemplate(data_json.game_template);
      }

      // setGameTemplate(lastMessage.sdata)
    }

    // console.log(lastMessage);
  }, [lastMessage]);

  useEffect(() => {
    if (isOver) {
      toast.success(`Game Over! the winner is${data.winner}`);
    }
  }, [isOver]);

  return (
    <div>
      <Toaster />
      {/* <div>Terminado?: {isOver && isOver.toString()}</div> */}
      <div className="grid grid-cols-3 w-[370px] h-[370px] mx-auto">
        {gameTemplate &&
          gameTemplate.map((row, rowIndex) => {
            return row.map((item, columnIndex) => (
              <div
                data-id={rowIndex * row.length + columnIndex}
                key={columnIndex}
                onClick={!isOver ? handleSelect : undefined}
                className={`flexi ${columnIndex !== 2 ? "border-r-2" : ""} ${
                  rowIndex !== 2 ? "border-b-2" : ""
                }`}
              >
                {item === 1 ? figures.circle : item === 0 ? figures.cross : ""}
              </div>
            ));
          })}
      </div>
      <div></div>
    </div>
  );
};

export default TriLine;
