import { useState, useEffect, useMemo } from 'react';
import * as alertService from './services/alert.services';
import * as localStorageService from './services/localStorage.services';
import IRoute from './models/route.model';
import { IMap } from './models/map.model';
import { Status } from './models/alert.model';
import { Announcement, AnnouncementType } from './components/Announcement';
import { DisplayRoute } from './components/DisplayRoute/DisplayRoute';
import Header from './components/Header';
import ButtonWithTimer from './components/ButtonWithTimer';
import LoadingWithCircle from './components/LoadingWithCircle';
import SelfExpandable from './components/SelfExpandable';
import { localStorageInitializer } from './helpers/localStorage.helper';
import { epochToText } from './helpers/epochToText';

const App = () => {
  // states of App
  const [isConnected, setIsConnected] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);
  // data for app
  const [map, setMap] = useState<IMap>();
  const [routes, setRoutes] = useState<IRoute[]>();
  const [updatedAt, setUpdatedAt] = useState<number>();

  const setMapRoutesByGetAlerts = async () => {
    const localStorageRoutes = await localStorageService.getRoutes() ?? [ ] as IRoute[];
    const localStorageUpdatedAt = await localStorageService.getAlertsUpdatedAt();

    let nextRoutes = localStorageRoutes;
    let nextUpdatedAt = localStorageUpdatedAt;
    let nextIsConnected: boolean = false;

    try {
      const alerts = await alertService.getAll();
      const prevRoutes = localStorageRoutes.map(route => ({
        order: route.order,
        line: route.line,
        stations: route.stations,
        presumedDelays: [ ],
        presumedNoService: [ ],
        officialDelays: [ ],
        officialNoService: [ ],
      } as IRoute));
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
              break; // do nothing
            }
          }
        }
      });
      nextRoutes = newRoutes;
      localStorageService.setRoutes(nextRoutes);

      nextUpdatedAt = Date.now();
      localStorageService.setAlertsUpdatedAt(nextUpdatedAt);

      nextIsConnected = true;
    }
    catch(error) {
      // console.error(error);
    }
    finally {
      setMap(await localStorageService.getMap());
      setRoutes(nextRoutes);
      setUpdatedAt(nextUpdatedAt);
      setIsConnected(nextIsConnected);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    localStorageInitializer(setMapRoutesByGetAlerts).then()
  },[]);

  const refreshButtonOnClick = () => {
    setIsLoading(true);
    setMapRoutesByGetAlerts().then();
  }

  const resetMapOnClick = () => {
    localStorage.clear();
    window.location.reload();
  }

  const updatedAtToText = useMemo(() => epochToText(updatedAt), [updatedAt]);

  return (
    <div className="w-screen h-screen bg-slate-800 p-4">
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
        {!isLoading && (
          <ButtonWithTimer timer={10} onClick={refreshButtonOnClick} />
        )}
        <SelfExpandable jsxElement={(<>
          <div className="text-slate-500 text-xs text-center">UpdatedAt: {!isLoading ? updatedAtToText : <span className="animate-pulse back">Loading</span>} / MapVersion: {!isLoading ? map?._id : <span className="animate-pulse back">Loading</span>}</div>
          <div className="text-slate-600 text-xs text-right mt-1">
            <span className="cursor-default" onClick={resetMapOnClick}>Reset the map</span>
          </div>
        </>)} />
      </div>
    </div>
  );
}

export default App;
