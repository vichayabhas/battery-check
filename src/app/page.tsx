"use client";

import React from "react";

// Define the BatteryManager type (not included in lib.dom.d.ts)
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(
    type:
      | "chargingchange"
      | "levelchange"
      | "chargingtimechange"
      | "dischargingtimechange",
    listener: () => void
  ): void;
  removeEventListener(
    type:
      | "chargingchange"
      | "levelchange"
      | "chargingtimechange"
      | "dischargingtimechange",
    listener: () => void
  ): void;
}

// Extend navigator type
interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export default function Battery() {
  const [level, setLevel] = React.useState<number | null>(null);
  const [isCharge, setIsCharge] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const nav = navigator as NavigatorWithBattery;

    if (!nav.getBattery) {
      console.warn("Battery API not supported");
      return;
    }

    // let batteryRef: BatteryManager | null = null;

    const initBattery = async () => {
      const battery = await nav.getBattery!();
      // batteryRef = battery;

      const updateLevel = () =>
        setLevel((old) => {
          if(!old){
            return battery.level*100
          }
          if(old==battery.level*100){
            return old
          }
          return battery.level * 100;
        });
      const updateCharge = () =>
        setIsCharge((old) => {
          if(!old){
            return battery.charging
          }
          if(old==battery.charging){
            return old
          }
          return battery.charging;
        });

      updateLevel(); // set initial value
      updateCharge();
      battery.addEventListener("levelchange", updateLevel);
      battery.addEventListener("chargingchange", updateCharge);

      return () => {
        battery.removeEventListener("levelchange", updateLevel);
        battery.removeEventListener("chargingchange", updateCharge);
      };
    };

    let cleanup: (() => void) | undefined;
    initBattery().then((fn) => {
      cleanup = fn;
    });

    return () => {
      if (cleanup) cleanup();
      // batteryRef = null;
    };
  }, []);

  return (
    <div>
      {level !== null && isCharge !== null ? (
        <p>
          🔋 Battery: {level.toFixed(0)}%
          {isCharge ? <>charge</> : <> not charge</>}
        </p>
      ) : (
        <p>Battery API not supported</p>
      )}
    </div>
  );
}
