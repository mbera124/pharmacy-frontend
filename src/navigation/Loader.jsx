import React from "react";
import { RingLoader } from "react-spinners";

export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
      }}
    >
      <RingLoader size={50} color="#343e54" margin={2} />
    </div>
  );
}
