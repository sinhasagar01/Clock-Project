import { useEffect, useState, useRef } from "react";
import "./Clock.css";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [draggingHand, setDraggingHand] = useState(null);
  const [draggedAngle, setDraggedAngle] = useState(0);
  const clockRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const formatTime = (date) => {
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const [displayTime, setDisplayTime] = useState(formatTime(time));

  useEffect(() => {
    const timerId = setInterval(() => {
      if (!draggingHand && !isEditing) {
        const newTime = new Date(time.getTime() + 1000);
        setTime(newTime);
      }
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [draggingHand, isEditing, time]);

  useEffect(() => {
    if (!draggingHand) {
      setDisplayTime(formatTime(time));
    }
  }, [draggingHand, time]);

  const handleHandMouseDown = (event, hand) => {
    event.preventDefault();
    setDraggingHand(hand);
  };

  const handleMouseMove = (event) => {
    if (draggingHand) {
      const clockRect = clockRef.current.getBoundingClientRect();
      const clockCenterX = clockRect.left + clockRect.width / 2;
      const clockCenterY = clockRect.top + clockRect.height / 2;
      const angle = Math.atan2(
        event.clientY - clockCenterY,
        event.clientX - clockCenterX
      );
      const newDraggedAngle = Math.round(angle * (180 / Math.PI) / 6) * 6;
      setDraggedAngle(newDraggedAngle);
      const minuteDiff = Math.floor((newDraggedAngle - draggedAngle) / 6);
      const newTime = new Date(time.getTime());
      if (draggingHand === "min_hand") {
        newTime.setMinutes(newTime.getMinutes() + minuteDiff);
      } else {
        newTime.setSeconds(newTime.getSeconds() + minuteDiff);
      }
      setTime(newTime);
    }
  };

  const handleMouseUp = () => {
    setDraggingHand(null);
    setDraggedAngle(0);
  };

  const handleDisplayChange = (event) => {
    setDisplayTime(event.target.value);
  };

  const handleDisplayFocus = () => {
    setIsEditing(true);
  };

  const handleDisplayBlur = () => {
    setIsEditing(false);
    const [newMinutes, newSeconds] = displayTime.split(":");
    const newTime = new Date();
    newTime.setMinutes(parseInt(newMinutes, 10));
    newTime.setSeconds(parseInt(newSeconds, 10));
    setTime(newTime);
  };

  return (
    <div>
      <div
        className="clock"
        ref={clockRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="min_hand"
          onMouseDown={(e) => handleHandMouseDown(e, "min_hand")}
          style={{
            transform: `rotateZ(${time.getMinutes() * 6 + draggedAngle}deg)`,
          }}
        />
        <div
          className="sec_hand"
          onMouseDown={(e) => handleHandMouseDown(e, "sec_hand")}
          style={{
            transform: `rotateZ(${time.getSeconds() * 6 + draggedAngle}deg)`,
          }}
        />
        <span className="twelve">12</span>
        <span className="one">1</span>
        <span className="two">2</span>
        <span className="three">3</span>
        <span className="four">4</span>
        <span className="five">5</span>
        <span className="six">6</span>
        <span className="seven">7</span>
        <span className="eight">8</span>
        <span className="nine">9</span>
        <span className="ten">10</span>
        <span className="eleven">11</span>
      </div>
      <div className="display">
        <input
          type="text"
          value={displayTime}
          onChange={handleDisplayChange}
          onFocus={handleDisplayFocus}
          onBlur={handleDisplayBlur}
        />
      </div>
    </div>
  );
};

export default Clock;
