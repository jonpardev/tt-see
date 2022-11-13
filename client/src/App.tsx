import { useState, useEffect, useCallback, Fragment } from 'react';
import * as alertService from './services/alert.services';
import * as mapService from './services/map.services';
import * as localStorageService from './services/localStorage.services';
import IRoute from './models/route.model';
import { IMap, ILine, IStation, ILineDto } from './models/map.model';
import { Status } from './models/alert.model';
import { Announcement, AnnouncementType } from './components/Announcement';
import { DisplayRoute } from './components/DisplayRoute';


const App = () => {
  const [isLocalStorageReady, setIsLocalStorageReady] = useState<boolean>();
  const [isConnected, setIsConnected] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<number>();
  const [textifiedUpdatedAt, setTextifiedUpdatedAtText] = useState<string>();
  const [map, setMap] = useState<IMap>();
  const [routes, setRoutes] = useState<IRoute[]>();
  const [isWaiting, setIsWaiting] = useState<boolean>();
  const [buttonLockTimer, setButtonLockTimer] = useState<number>();

  useEffect(() => {
    const localStorageMapUpdater = async () => {
      try {
        const map = await localStorageService.getMap();
        if (!map) {
          const mapDto = await mapService.getMapDto();
          localStorageService.setMapLines(mapDto);
        } else {
          const latestId = await mapService.getLatestId();
          if (latestId !== map._id) {
            const mapDto = await mapService.getMapDto();
            localStorageService.setMapLines(mapDto);
          }
        }
      }
      catch(error) {
        // console.error(error);
      }
    }
    const localStorageRoutesUpdater = async () => {
      try {
        const localStorageRoutes = await localStorageService.getRoutes();
        // <!-- temporary function until the route selection is implemented
        if (!localStorageRoutes || localStorageRoutes.length === 0) {
          const allSubwayLines = await allSubwayLinesProvider();
          localStorageService.setRoutes(allSubwayLines);
          // -->
        }
      } catch(error) {
        // console.error(error);
      }
    }

    // <!-- temporary function before the route selection is implemented
    const allSubwayLinesProvider = async () => {
      const allSubwayLines = await localStorageService.getLines();
      let newRoutes: IRoute[] = [ ];
      if (allSubwayLines) {
        allSubwayLines.sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number));
        allSubwayLines.forEach((line: ILineDto, index: number) => {
          const stations = line.stations.sort((a, b) => a.order - b.order);
          newRoutes.push(lineToRoute(index, line, stations[0], stations[stations.length - 1]));
        });
      }
      return newRoutes;
    }
    // -->

    localStorageMapUpdater()
      // originally, map/routes updater are designed working separately
      // but because the temporary function, allSubwayLinesProvider() uses getLines(),
      // they are working asynchronously
      .then(() => localStorageRoutesUpdater())
      .then(() => setIsLocalStorageReady(true));
  }, []);

  const textifyUpdatedAt = useCallback(async (updatedAt: number) => {
    const unixTimeDifferenceToText = (behindTime: number, aheadTime: number) => {
      const difference = aheadTime - behindTime;
      if (difference < 0) throw new Error(`Time difference cannot be negative`);
      const asMinutes = Math.floor(difference/60000);
      const asHours = Math.floor(difference/3600000);
      const asDays = Math.floor(difference/86400000);
      if (asDays > 1) return `${asDays} days ago`;
      if (asDays === 1) return `1 day ago`;
      if (asHours > 1) return `${asHours} hours ago`;
      if (asHours === 1) return `1 hours ago`;
      if (asMinutes > 1) return `${asMinutes} minutes ago`;
      if (asMinutes === 1) return `1 minute ago`;
      return `seconds ago`;
    }

    let resultText = '-';

    try {
      if (updatedAt === undefined) throw new Error();
      const nowUnixTime = Date.now();
      resultText = unixTimeDifferenceToText(updatedAt, nowUnixTime);
    }
    catch(error) {
      // console.error(error);
    }
    finally {
      setTextifiedUpdatedAtText(resultText);
    }
  }, []);

  const SetMapRoutesByGetAlerts = useCallback(async () => {
    const localStorageRoutes = await localStorageService.getRoutes() ?? [ ] as IRoute[];
    const prevRoutes = localStorageRoutes.map(route => ({
      order: route.order,
      line: route.line,
      stations: route.stations,
      presumedDelays: [ ],
      presumedNoService: [ ],
      officialDelays: [ ],
      officialNoService: [ ],
    } as IRoute));

    try {
      const alerts = await alertService.getAll();
      let newRoutes = [...prevRoutes] // shallow copy
      alerts.forEach(alert => {
        const route = newRoutes.find((route: IRoute) => (route.line._id === alert.line_id));
        if (route) {
          switch (alert.status) {
            case (Status.OfficialDelays): {
              route.officialDelays.push(alert.station_id);
              break;
            }
            case (Status.OfficialNoService): {
              route.officialNoService.push(alert.station_id);
              break;
            }
            case (Status.PresumedDelays): {
              route.presumedDelays.push(alert.station_id);
              break;
            }
            case (Status.PresumedNoService): {
              route.presumedNoService.push(alert.station_id);
              break;
            }
            default: {
              // do nothing
              break;
            }
          }
        }
      });
      localStorageService.setRoutes(newRoutes);
      setRoutes(newRoutes);

      const nowUnixTime = Date.now();
      localStorageService.setAlertsUpdatedAt(nowUnixTime);
      setUpdatedAt(nowUnixTime);

      setIsConnected(true);
    }
    catch(error) {
      console.error(error);
      setRoutes(localStorageRoutes);
      const updatedAt = await localStorageService.getAlertsUpdatedAt();
      if(updatedAt) textifyUpdatedAt(updatedAt); // because updatedAt is not changed
      setIsConnected(false);
    }
    finally {
      setMap(await localStorageService.getMap());
      setIsLoading(false);
    }
  }, [textifyUpdatedAt]);

  useEffect(() => {
    if (isLocalStorageReady) SetMapRoutesByGetAlerts();
  }, [isLocalStorageReady, SetMapRoutesByGetAlerts]);

  const lineToRoute = (order:number, line: ILineDto, start: IStation, end: IStation) => {
    const newLine: ILine = {
      _id: line._id,
      type: line.type,
      number: line.number,
      name: line.name,
      bgColor: line.bgColor,
      textColor: line.textColor,
    }
    let stationIds: number[] = [];
    const stations = line.stations.sort((a, b) => a.order - b.order);
    if (start.order < end.order) stationIds = stations.slice(start.order - 1, end.order).map(station => station._id);
    else if (start.order > end.order) stationIds = stations.slice(end.order - 1, start.order).sort((a, b) => b.order - a.order).map(station => station._id);
    else stationIds = [start._id];
    return {
      order: order,
      line: newLine,
      stations: stationIds,
      presumedDelays: new Array<number>(),
      presumedNoService: new Array<number>(),
      officialDelays: new Array<number>(),
      officialNoService: new Array<number>(),
    } as IRoute;
  }

  const refreshButtonOnClick = useCallback(async () => {
    if (!isWaiting) {
      setIsLoading(true);
      setIsWaiting(true);
      SetMapRoutesByGetAlerts().then(() =>  setButtonLockTimer(10));
    }
  }, [isWaiting, SetMapRoutesByGetAlerts]);

  useEffect(() => {
    if(updatedAt !== undefined) {
      textifyUpdatedAt(updatedAt).then();
    }
  }, [updatedAt, textifyUpdatedAt]);

  const resetMapOnClick = () => {
    localStorage.clear();
    window.location.reload();
  }

  useEffect(()=> {
    if (buttonLockTimer !== undefined) {
      if (buttonLockTimer > 0) {
        setTimeout(() => {
          const currentTimer = buttonLockTimer;
          setButtonLockTimer(currentTimer - 1);
        }, 1000);
      }
      if (buttonLockTimer === 0) {
        setButtonLockTimer(undefined);
        setIsWaiting(false);
      }
    }
  }, [buttonLockTimer]);

  return (
    <div className="w-screen h-screen bg-slate-800 p-4">
      <div className="max-w-sm mx-auto bg-slate-700 p-4 rounded-lg border-slate-500">
        <header className="w-full text-center mb-4">
          <h1 className="text-3xl text-white font-bold">TT-See</h1>
          <h2 className="text-sm text-white">Toronto Subway Watcher</h2>
        </header>
        {isConnected === false && (<Announcement type={AnnouncementType.Alert} message="⛔ Failed to update!" />)}
        <div className={`${(isConnected === undefined || isConnected === true) ? "bg-slate-900" : "bg-rose-600"} ${isLoading && "animate-pulse"} text-white px-4 py-3 rounded-lg`}>
          {(!isLoading) ? (
            <Fragment>
            {routes?.map((route: IRoute) => (
              <DisplayRoute key={route.order} route={route} />
              ))}
            </Fragment>
          ) : (
            <div className="inline-flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" className="stroke-slate-200" strokeWidth="4" strokeDasharray="40" strokeDashoffset="40"></circle>
                <circle cx="12" cy="12" r="10" className="stroke-slate-200 opacity-25" strokeWidth="4"></circle>
              </svg>
              Loading...
            </div>
          )}
        </div>
        {/* <div className="text-slate-900 text-sm mt-2">{`🟣 Need-to-check means TT-See detected possible problems on the line`}</div> */}
        {!isLoading && (
          <button className={`w-full ${isWaiting ? `bg-slate-700 text-slate-600` : `bg-slate-600 hover:bg-slate-500 rounded-lg text-white`} my-4 py-8`} onClick={refreshButtonOnClick}>{isWaiting ? `Waiting...${buttonLockTimer}s` : `Refresh!`}</button>
        )}

        <div className="mt-3 text-slate-500 text-xs text-right">UpdatedAt: {!isLoading ? textifiedUpdatedAt : <span className="animate-pulse back">Loading</span>} / MapVersion: {!isLoading ? map?._id : <span className="animate-pulse back">Loading</span>}</div>
        <div className="text-slate-600 text-xs text-right mt-1">
          <span className="cursor-default" onClick={resetMapOnClick}>Reset the map</span>
        </div>
      </div>
    </div>
  );
}

export default App;
