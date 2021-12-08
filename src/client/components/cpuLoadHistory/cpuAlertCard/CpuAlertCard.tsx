import { CPULoadAlertTypes, CPULoadDataPoint } from '../../dataLoader/data-types';
import './CpuAlertCard.css';

function CpuAlertCard(props: CPULoadDataPoint) {
  return (
        <div className='cpu-alert-card' >
        <div className={`alert-body ${props.isAlert === CPULoadAlertTypes.OVERLOAD ? 'alert' : 'recovery'}`} >
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <img className={'alertIcon'} src={`${props.isAlert === CPULoadAlertTypes.OVERLOAD ? 'cpu_load_overload_icon.png' : 'cpu_recovery_icon.jpg'}`} alt="" />
                <span className={`title ${props.isAlert === CPULoadAlertTypes.OVERLOAD ? 'alert' : 'recovery'}`} >
                    <span>{props.isAlert === CPULoadAlertTypes.OVERLOAD ? ' Overload' : 'Recovery'}</span>
                </span>
            </div>
            <div className='alert-info'>
                <span className={'info'} >{`Load average: ${Math.round(props.cpuLoad)}`}</span>
                <span className={'info'} >{`Triggered at: ${new Date(props.timestamp).toLocaleTimeString()}`}</span>
            </div>      
        </div>
        <div className={'notificationFooter'} />
        </div>
  );
}

export default CpuAlertCard;
