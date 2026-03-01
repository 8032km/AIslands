"use client";
import { useState, useEffect } from "react";
import WaterCanvas from "./WaterCanvas";
import { PixelBird } from "./PixelSprites";

/*
  Full-screen travel animation:
  1. Ocean fills the screen
  2. A pixel bird flies from left to right
  3. Destination island fades in at center
  4. onComplete fires after animation
*/
export default function TravelAnimation({ destinationSprite, onComplete }) {
    const [phase, setPhase] = useState("fly"); // fly → arrive → done

    useEffect(() => {
        // Bird flies for 2.5s, then island appears for 1.2s
        const t1 = setTimeout(() => setPhase("arrive"), 2500);
        const t2 = setTimeout(() => {
            setPhase("done");
            onComplete?.();
        }, 4000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onComplete]);

    return (
        <div className="travel-overlay">
            <WaterCanvas />

            {/* Flying bird */}
            <div className={`travel-bird ${phase}`}>
                <PixelBird width={60} />
            </div>

            {/* Trail of small birds */}
            <div className={`travel-bird-trail ${phase}`}>
                <span style={{ animationDelay: "0.3s" }}><PixelBird width={30} /></span>
                <span style={{ animationDelay: "0.6s" }}><PixelBird width={24} /></span>
            </div>

            {/* Destination island */}
            <div className={`travel-destination ${phase}`}>
                {destinationSprite}
            </div>

            {/* Text */}
            <div className={`travel-text ${phase}`}>
                <p className="travel-traveling">Traveling...</p>
            </div>
        </div>
    );
}
