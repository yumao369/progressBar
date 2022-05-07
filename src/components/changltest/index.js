import React, { useEffect, useState } from "react";

export default function Cltest () {
  let a = 1;
  const [aa, setAa] = useState(2)
  const [bb, setBb] = useState(1)
  useEffect(() => {
    console.log('a', a)
    console.log('bb', bb)
    change()
    console.log('a', a)
  })
  const change = () => {
    a = 2
  }
  return <div>
    <button onClick={() => { setAa(aa + 1) }}>aa</button>
    <button onClick={() => { setBb(bb + 1) }}>bb</button>
  </div>
}