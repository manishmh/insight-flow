import { useEffect, useState } from "react";

interface DivPosition {
  top: number;
  left: number;
}

const FloatingDivs = ({ online }: { online: boolean }) => {
  const [positions, setPositions] = useState<DivPosition[]>([
    { top: 10, left: 85 },
    { top: 30, left: 50 },
    { top: 60, left: 80 },
    { top: 70, left: 30 },
  ]);

  const texts = ["Pankaj", "Mariya", "Div", "You"];
  const bgColors = ["bg-blue-400", "bg-red-400", "bg-green-400", "bg-pink-400"];

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const moveDivs = () => {
      setPositions((prevPositions) =>
        prevPositions.map((pos) => {
          const newTop = pos.top + (Math.random() * 50 - 25); // More random movement
          const newLeft = pos.left + (Math.random() * 50 - 25);
          const boundedTop = Math.min(90, Math.max(0, newTop));
          const boundedLeft = Math.min(90, Math.max(0, newLeft));
          return { top: boundedTop, left: boundedLeft };
        })
      );
    };

    if (online) {
      intervalId = setInterval(moveDivs, 2000); // Start movement if online
    } else if (intervalId) {
      clearInterval(intervalId); // Clear interval if not online
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clean up on unmount or if online changes
      }
    };
  }, [online]); // Re-run effect when online changes

  return (
    <div className="absolute inset-0 bg-transparent z-0">
      <div className="relative w-full h-full">
        {positions.map((pos, index) => (
          <div
            key={index}
            className={`px-4 py-1 text-sm flex items-center rounded-tr-lg rounded-bl-lg justify-center text-gray-800 absolute transition-all duration-1000 ${
              bgColors[index % bgColors.length]
            }`}
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
            }}
          >
            <div className="relative">
              {texts[index % texts.length]}
              <div
                className={`${bgColors[index % bgColors.length]} w-2 h-2 absolute -top-3 -left-6`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingDivs;
