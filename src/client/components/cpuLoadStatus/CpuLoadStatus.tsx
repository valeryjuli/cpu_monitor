import { useEffect, useState } from 'react';
import { CPUDataGlobalState, UserInformation } from '../dataLoader/data-types';
import CpuGauge from './cpuGauge/CpuGauge';
import './CpuLoadStatus.css';
import CpuProcessorCard from './cpuProcessorCard/CpuProcessorCard';

/**
 * Component displaying current Average CPU Load and user information
 */
function CpuLoadStatus(props: CPUDataGlobalState) {

  const [userInformation, setuserInformation] = useState<UserInformation>({
    cpuTotal: 0,
    platform: 'NaN',
    cpus: [{
      model: 'NaN',
      speed: 0,
      times: {}
    }]})
  
  const getUserInformation = async (): Promise<UserInformation> => {
    const request = new Request('http://localhost:5000/userInfo');
    return fetch(request)
        .then((response: any) => response.json())
        .then((data: UserInformation) => {
          console.log(data)
          setuserInformation(data);
          return data
    })
}

useEffect(() => {
  getUserInformation();
}, [])

  return (
    <div className="cpu-load-status">
      <h1>CPU Load Monitor</h1>
      <span>Here you will find the relative percentage of CPU load from your system.</span>
      <span>This monitor allows you to see the latest alerts of overload and recovery of the system.</span>
      <CpuGauge {...props}/>
      <div className='system-info-card'>
        <img src="cpu-info-icon.png" style={{padding: '8px', borderRadius: '50%', height: '35px', width: '35px'}}></img>
        <div className='system-info-text'>
          <span><strong>Number of Cores: </strong>{`${userInformation.cpuTotal}`}</span>
          <span><strong>Platform: </strong>{`${userInformation.platform}`}</span>
        </div>
      </div>
      <div className='system-cpus-cards'>
          {userInformation.cpus.map((processor, i) => {
            return <CpuProcessorCard key={i} {...processor} />
          })}
      </div>
    </div>
  );
}

export default CpuLoadStatus;
