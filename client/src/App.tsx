import { useState, useEffect, useCallback, Fragment } from 'react';
import * as alertService from './services/alert.services';
import * as mapService from './services/map.services';
import * as localStorageService from './services/localStorage.services';
import IRoute from './models/route.model';
import { IMap, ILine, IStation, ILineDto } from './models/map.model';
import { Status } from './models/alert.model';
import { Announcement, AnnouncementType } from './components/Announcement';
import { DisplayRoute } from './components/DisplayRoute';
import Header from './components/Header';
import ButtonWithTimer from './components/ButtonWithTimer';
import LoadingWithCircle from './components/LoadingWithCircle';


const App = () => {
  const [isLocalStorageReady, setIsLocalStorageReady] = useState<boolean>();
  const [isConnected, setIsConnected] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<number>();
  const [textifiedUpdatedAt, setTextifiedUpdatedAtText] = useState<string>();
  const [map, setMap] = useState<IMap>();
  const [routes, setRoutes] = useState<IRoute[]>();

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

  const setMapRoutesByGetAlerts = useCallback(async () => {
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
    if (isLocalStorageReady) setMapRoutesByGetAlerts();
  }, [isLocalStorageReady, setMapRoutesByGetAlerts]);

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

  const refreshButtonOnClick = () => {
    setIsLoading(true);
    setMapRoutesByGetAlerts().then();
  }

  useEffect(() => {
    if(updatedAt !== undefined) {
      textifyUpdatedAt(updatedAt).then();
    }
  }, [updatedAt, textifyUpdatedAt]);

  const resetMapOnClick = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="w-screen h-screen bg-slate-800 p-4">
      {/* <div className="max-w-sm mx-auto bg-slate-700 p-4 rounded-lg border-slate-500"> */}
      <div className={`max-w-sm mx-auto p-4 rounded-lg flex flex-col gap-4 ${(isConnected === undefined || isConnected === true) ? "bg-slate-900" : "bg-rose-900"} ${isLoading && "animate-pulse"}`}>
        <Header />
        {isConnected === false && (<Announcement message="Update failed" type={AnnouncementType.Alert} />)}
        {(!isLoading) ? (
        <>
        {routes?.map((route: IRoute) => (
          <DisplayRoute key={route.order} route={route} />
        ))}
        </>
        ) : (
        <LoadingWithCircle />
        )}
        {/* <div className="text-slate-900 text-sm mt-2">{`🟣 Need-to-check means TT-See detected possible problems on the line`}</div> */}
        {!isLoading && (
          <ButtonWithTimer timer={10} onClick={refreshButtonOnClick} />
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
