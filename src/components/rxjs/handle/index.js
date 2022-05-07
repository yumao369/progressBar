import React, { useEffect } from "react";
import styles from "./index.module.css"

export default function Handle ({ value }) {
  useEffect(() => {
    console.log('handlevalue', value)
  })
  return <div className={styles.handle} ></div>
}