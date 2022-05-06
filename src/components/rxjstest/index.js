import React, { useEffect, useRef, useState } from "react";
import { fromEvent, filter, take } from 'rxjs'
import styles from "./index.module.css"

export default function RxjsTest () {
  let dragStart$
  let dragMove$
  let dragEnd$
  let dragStart_
  let dragMove_
  let dragEnd_
  const divRef = useRef(null)
  const [handleStylse, setHandleStylse] = useState({})
  const [barStylse, setBarStylse] = useState({})

  useEffect(() => {
    //const click$ = fromEvent(divRef.current, 'click').subscribe(x => console.log(x))
    //return () => click$.unsubscribe()
    createObservables()
    return () => { unsubscribeObservable() }
  })

  const createObservables = () => {
    dragStart$ = fromEvent(divRef.current, 'mousedown')
    dragMove$ = fromEvent(divRef.current, 'mousemove')
    dragEnd$ = fromEvent(divRef.current, 'mouseup')
    dragStart_ = dragStart$.subscribe(x => console.log(x))
    dragMove_ = dragMove$.pipe(take(2)).subscribe(x => console.log(x))
    dragEnd_ = dragEnd$.subscribe(x => console.log(x))
  }

  const unsubscribeObservable = () => {
    dragStart_.unsubscribe()
    dragMove_.unsubscribe()
    dragEnd_.unsubscribe()
  }





  return <div className={styles.base} ref={divRef}>
    <div className={styles.handle} style={handleStylse}></div>
    <div className={styles.bar} style={barStylse}></div>
  </div>
}