import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#333638",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#C79A2B",
          fontWeight: 900,
          borderRadius: 8,
          border: "2px solid #C79A2B",
          fontFamily: "sans-serif",
        }}
      >
        B
      </div>
    ),
    {
      ...size,
    }
  );
}
