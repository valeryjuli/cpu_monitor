# CPU Average Load Monitor

This project implements a CPU Average Load Monitor with the following capabilities:

- Monitor on a D3 Line Chart the evolution of CPU Average Load in the last 10minutes
- Visualize current CPU Average Load
- Monitor alerts for overloading and recovery

## How to deploy?

In the project directory run:

### `npm install`

To start the backend-service run

### `npm start-server`

This starts the backend service on the port 5000 by default
Open [http://localhost:5000/userInfo](http://localhost:5000/userInfo) to view the user OS information

To start the frintend application run

### `npm start`

This starts the frontend React application on the port 3000 by default
Open [http://localhost:3000](http://localhost:3000) to view the CPU Monitor

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Support
- Supports UNIX and MS based OS thanks to the `loadavg-windows` library.
- Support for all modern browsers

## Specifications
### Frequency of data request
Data is requested from the backend service every 10seconds

### Data persistence on Frontend
The CPU Average Load is stored on the Frontend application using a Queue. The Queue stores the values of CPU Average Load received for the last 10minutes.

### Alerting System
An OVERLOAD Alert is displayed below the CPU Monitor Chart if:
> :warning: The CPU Average load has exceeded 1 for 2 minutes or more.

A RECOVERY Alert is displayed below the CPU Monitor Chart if:
> :warning: The CPU Average load has dropped from 1 for 2 minutes or more.

## Improvements
If this dashboard was being built from production I would consider the following points:

- The dependencies used can be drastically reduced if the react application was built from scratch instead of the `create-react-app` used in this version for POC purposes
- The frontend application SVGs resizing can be improved to support multiple devices and screen sizes in a more suitable way
- The data being stored on the frontend could be passed through a context instead of props drilling
- The fetching of the backend information needs to be more error-proofed with a better error handling
- An UI/UX baseline could be defined to unifify cards design, color schema and buttons for a better experience
- The components need to be tested deeply and under high stress, for example plotting points on a high frequency


