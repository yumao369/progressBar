import React, { useRef, useState } from 'react'
import './progress.css';
const data = [{
  "users": 0,
  "price": 0
},
{
  "users": 800,
  "price": 49.99
},
{
  "users": 2000,
  "price": 79.99
},
{
  "users": 10000,
  "price": 299
},
{
  "users": 15000,
  "price": 370
},
{
  "users": 20000,
  "price": 420
},
{
  "users": 25000,
  "price": 480
},
{
  "users": 30000,
  "price": 530
},
{
  "users": 40000,
  "price": 580
},
{
  "users": 50000,
  "price": 640
},
{
  "users": 75000,
  "price": 700
},
{
  "users": 100000,
  "price": 750
},
{
  "users": 130000,
  "price": 850
},
{
  "users": 150000,
  "price": 950
},
{
  "users": 200000,
  "price": 1190
}]
export default function Progress () {
  let steps = data.length;
  let incrementWidth = 334 / steps;
  const [ptrPosition, setPtrPosition] = useState(null);
  const ptrRef = useRef(null);
  let isMouseDown = false;
  let x = 0;

  const handleClick = (e) => {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    console.log(x);
    console.log('steps', steps);
    console.log('incrementWIDTH', incrementWidth);
    setPtrPosition(x);
    // console.log(e.target);
  }

  const handleMouseLeave = (e) => {
    isMouseDown = false;
  }

  const handleMouseMove = (e) => {
    if (!isMouseDown) {
      return;
    }
    e.preventDefault();
    var rect = document.querySelector('.progress-wrapper').getBoundingClientRect();
    console.log(rect);
    x = e.clientX - rect.left;

    console.log(x);
  }

  const handleMouseUp = (e) => {
    isMouseDown = false;
    setPtrPosition(x);
  }
  const handleMouseDown = (e) => {
    isMouseDown = true;

  }
  return (
    <div className="progress-wrapper"
      onMouseLeave={handleMouseLeave}
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={handleMouseUp}>
      <div className="progress" style={{
        width: ptrPosition
      }}>
        <div className="pointer" ref={ptrRef}
        >
          <div className="toast">

          </div>
        </div>
      </div>
    </div>
  )
}
