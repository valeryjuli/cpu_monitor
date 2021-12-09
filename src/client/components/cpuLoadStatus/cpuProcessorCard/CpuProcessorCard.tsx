import { CPUInfo } from '../../dataLoader/data-types';
import './cpuProcessorCard.css';

/**
 * CPU Processor information card 
 */
function CpuProcessorCard(props: CPUInfo) {
  return (
    <div className="cpu-processor-card">
      <div className='cpu-processor-card'>
        <img src="core-icon.png" style={{padding: '8px', borderRadius: '50%', height: '35px', width: '35px'}}></img>
        <div className='cpu-processor-text'>
        <span><strong>Model: </strong>{`${props.model}`}</span>
        <span><strong>Speed: </strong>{`${props.speed}`}</span>
        </div>
      </div>
    </div>
  );
}

export default CpuProcessorCard;
