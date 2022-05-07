import React, { useEffect, useRef, useState } from "react";
import { fromEvent, filter, take, tap, pluck, map, distinctUntilChanged, takeUntil, merge } from 'rxjs'
import Handle from "./handle";
import styles from "./index.module.css"

export default function RxjsTest1 () {
  let wyMin = 0
  let wyMax = 100
  let dragStart$
  let dragMove$
  let dragEnd$
  let dragStart_
  let dragMove_
  let dragEnd_
  let isDragging = false
  const divRef = useRef(null)
  let value1 = 0
  const [handleStylse, setHandleStylse] = useState({})
  const [barStylse, setBarStylse] = useState({})
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    createObservables()
    subscribeDrag(['start'])
    console.log('valuerender', value1)
    return () => { unsubscribeDrag() }
  })

  useEffect(() => {
    setOffset(value1)
  }, [value1])

  const sliderEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  const inArray = (arr, target) => {
    return arr.indexOf(target) !== -1;
  }

  const createObservables = () => {
    console.log('111111111111')
    const orientField = 'pageX';
    const mouse = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };


    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filerFunc, pluckKey } = source;

      source.startPlucked$ = fromEvent(divRef.current, start)
        .pipe(
          filter(filerFunc),
          tap(sliderEvent),
          pluck(...pluckKey),
          map((position) => findClosestValue(position))
        );

      source.end$ = fromEvent(divRef.current, end);
      source.moveResolved$ = fromEvent(divRef.current, move).pipe(
        filter(filerFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position) => findClosestValue(position)),
        takeUntil(source.end$)
      );
    });
    dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    dragEnd$ = merge(mouse.end$, touch.end$);
    console.log(dragStart$)
  }

  const subscribeDrag = (events) => {
    console.log('events', events)
    if (inArray(events, 'start') && dragStart$ && !dragStart_) {
      dragStart_ = dragStart$.subscribe(position => onDragStart(position));
    }
    if (inArray(events, 'move') && dragMove$ && !dragMove_) {
      dragMove_ = dragMove$.subscribe(position => onDragMove(position));
    }
    if (inArray(events, 'end') && dragEnd$ && !dragEnd_) {
      dragEnd_ = dragEnd$.subscribe(() => { onDragEnd(); console.log('aaaaaaaa') });
    }
  }

  const unsubscribeDrag = (events) => {
    if (inArray(events, 'start') && dragStart_) {
      dragStart_.unsubscribe();
      dragStart_ = null;
    }
    if (inArray(events, 'move') && dragMove_) {
      dragMove_.unsubscribe();
      dragMove_ = null;
    }
    if (inArray(events, 'end') && dragEnd_) {
      dragEnd_.unsubscribe();
      dragEnd_ = null;
    }
  }

  const onDragStart = (value) => {
    toggleDragMoving(true);
    value1 = value
  }

  const onDragMove = (value) => {
    if (isDragging) {
      console.log('value', value)
      value1 = value
      console.log('value1', value1)
    }
  }
  const onDragEnd = () => {
    toggleDragMoving(false);
  }

  const toggleDragMoving = (movable) => {
    isDragging = movable;
    if (movable) {
      subscribeDrag(['move', 'end']);
    } else {
      unsubscribeDrag(['move', 'end']);
    }
  }

  const findClosestValue = (position) => {
    // 获取滑块总长
    const sliderLength = getSliderLength();

    // 滑块(左, 上)端点位置
    const sliderStart = getSliderStartPosition();

    // 滑块当前位置 / 滑块总长
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = ratio;
    return ratioTrue * (wyMax - wyMin) + wyMin;
  }


  const getSliderLength = () => {
    return divRef.current.clientWidth;
  }

  const getSliderStartPosition = () => {
    const offset = getElementOffset(divRef.current);
    return offset.left;
  }

  function getElementOffset (el) {
    if (!el.getClientRects().length) {
      return {
        top: 0,
        left: 0
      }
    }

    const rect = el.getBoundingClientRect();
    const win = el.ownerDocument.defaultView;

    return {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    }
  }

  const limitNumberInRange = (val, min, max) => {
    return Math.min(Math.max(val, min), max);
  }






  return <div className={styles.base} ref={divRef}>
    {
      console.log('inittttttttt,value1', value1)
    }
    <Handle value={value1} />
    <div className={styles.bar} style={barStylse}></div>
  </div>
}