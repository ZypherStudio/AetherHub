import './VirtualGamepad.css';

const VirtualGamepad = () => {
  return (
    <div className="virtual-gamepad-overlay fade-enter-active">
      {/* Left Controls (D-Pad and Left Analog) */}
      <div className="vg-left">
        <div className="vg-dpad">
          <button className="vg-btn dpad-up"></button>
          <button className="vg-btn dpad-right"></button>
          <button className="vg-btn dpad-down"></button>
          <button className="vg-btn dpad-left"></button>
          <div className="dpad-center"></div>
        </div>
        
        <div className="vg-analog left-analog">
          <div className="analog-stick"></div>
        </div>
      </div>

      {/* Right Controls (ABXY and Right Analog) */}
      <div className="vg-right">
        <div className="vg-action-buttons">
          <button className="vg-btn action-y">Y</button>
          <button className="vg-btn action-x">X</button>
          <button className="vg-btn action-b">B</button>
          <button className="vg-btn action-a">A</button>
        </div>

        <div className="vg-analog right-analog">
          <div className="analog-stick"></div>
        </div>
      </div>

      {/* Center Controls (Start / Select) */}
      <div className="vg-center">
        <button className="vg-btn-small">Select</button>
        <button className="vg-btn-small">Start</button>
      </div>
      
      {/* Top Bumpers (L1, R1, L2, R2) */}
      <div className="vg-bumpers left">
        <button className="vg-trigger">L2</button>
        <button className="vg-bumper">L1</button>
      </div>
      <div className="vg-bumpers right">
        <button className="vg-trigger">R2</button>
        <button className="vg-bumper">R1</button>
      </div>
    </div>
  );
};

export default VirtualGamepad;
