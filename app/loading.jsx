"use client";

import React from "react";

/**
 * RTU Solutions - Logo-style Animated Preloader
 * Drop this file as: app/loading.jsx  (Next.js App Router auto-loading screen)
 * or import <RTULoader /> anywhere you need a full-screen / inline loader.
 */

export default function Loading() {
  return <RTULoader />;
}

export function RTULoader() {
  return (
    <div className="rtu-loader-wrap">
      <div className="rtu-badge">
        {/* Rotating navy/orange ring with curved text */}
        <svg
          className="rtu-ring"
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path
              id="topArc"
              d="M 40,150 A 110,110 0 0 1 260,150"
              fill="none"
            />
            <path
              id="bottomArc"
              d="M 30,150 A 120,120 0 0 0 270,150"
              fill="none"
            />
          </defs>

          {/* base rings */}
          <circle cx="150" cy="150" r="145" fill="#0b1957" />
          <path
            d="M 5,150 A 145,145 0 0 0 295,150 L 260,150 A 110,110 0 0 1 40,150 Z"
            fill="#f7871f"
          />
          <circle cx="150" cy="150" r="108" fill="#ffffff" />

          {/* curved text */}
          <text className="rtu-text-top" fill="#ffffff">
            <textPath href="#topArc" startOffset="50%" textAnchor="middle">
              RAJASTHAN TECHNICAL UNIVERSITY
            </textPath>
          </text>
          <text className="rtu-text-bottom" fill="#ffffff">
            <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
              • KOTA •
            </textPath>
          </text>
        </svg>

        {/* Static center emblem (doesn't rotate) */}
        <div className="rtu-center">
          <svg viewBox="0 0 200 200" className="rtu-orbit-svg">
            <ellipse
              cx="100"
              cy="100"
              rx="85"
              ry="35"
              className="orbit orbit-1"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="85"
              ry="35"
              className="orbit orbit-2"
            />
          </svg>

          <div className="rtu-flame">
            <span className="flame-core" />
          </div>

          <div className="rtu-letters">RTU</div>
        </div>
      </div>

      <div className="rtu-pill">RTU SOLUTIONS</div>
      <div className="rtu-loading-text">Loading…</div>

      <style jsx>{`
        .rtu-loader-wrap {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 22px;
          background: #ffffff;
          z-index: 9999;
        }

        .rtu-badge {
          position: relative;
          width: 220px;
          height: 220px;
        }

        .rtu-ring {
          width: 100%;
          height: 100%;
          animation: rtu-spin 6s linear infinite;
          transform-origin: 150px 150px;
        }

        .rtu-text-top,
        .rtu-text-bottom {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 1px;
        }

        .rtu-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rtu-orbit-svg {
          position: absolute;
          width: 78%;
          height: 78%;
        }

        .orbit {
          fill: none;
          stroke: #6b8f71;
          stroke-width: 1.5;
        }

        .orbit-1 {
          transform-origin: 100px 100px;
          animation: rtu-spin 4s linear infinite;
        }

        .orbit-2 {
          transform: rotate(60deg);
          transform-origin: 100px 100px;
          animation: rtu-spin-reverse 5s linear infinite;
        }

        .rtu-flame {
          position: absolute;
          width: 34px;
          height: 44px;
          top: 38%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .flame-core {
          width: 16px;
          height: 26px;
          background: radial-gradient(
            circle at 50% 30%,
            #ffe08a 0%,
            #ff9d1f 45%,
            #e0521c 100%
          );
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: rtu-flicker 1.1s ease-in-out infinite;
        }

        .rtu-letters {
          position: absolute;
          bottom: 30%;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 900;
          font-size: 34px;
          color: #5a1616;
          letter-spacing: 1px;
        }N

        .rtu-pill {
          background: #0b1957;
          color: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: 2px;
          padding: 10px 34px;
          border-radius: 999px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
          animation: rtu-pulse-fade 1.8s ease-in-out infinite;
        }

        .rtu-loading-text {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          color: #666;
          letter-spacing: 1px;
        }

        @keyframes rtu-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rtu-spin-reverse {
          from {
            transform: rotate(60deg);
          }
          to {
            transform: rotate(-300deg);
          }
        }

        @keyframes rtu-flicker {
          0%,
          100% {
            transform: scaleY(1) scaleX(1);
            opacity: 1;
          }
          50% {
            transform: scaleY(1.15) scaleX(0.9);
            opacity: 0.85;
          }
        }

        @keyframes rtu-pulse-fade {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(0.97);
          }
        }
      `}</style>
    </div>
  );
}