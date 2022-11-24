import { useState, useEffect, useMemo, useLayoutEffect, MouseEvent } from 'react';
import * as alertService from './services/alert.services';
import * as localStorageService from './services/localStorage.services';
import IRoute from './models/route.model';
import { IMap } from './models/map.model';
import { Status } from './models/alert.model';
import { Announcement, AnnouncementType } from './components/Announcement';
import { DisplayRoute } from './components/DisplayRoute/DisplayRoute';
import Header from './components/Header/Header';
import ButtonWithTimer from './components/ButtonWithTimer';
import LoadingWithCircle from './components/LoadingWithCircle';
import SelfExpandable from './components/SelfExpandable';
import { localStorageInitializer } from './helpers/localStorage.helper';
import { epochToText } from './helpers/epochToText';
import { useAppSelector } from './store/hooks';
import { GlobalTheme } from './services/localStorage.services';
import setTheme from './helpers/setTheme';

const App = () => {
  // states of App
  const [isConnected, setIsConnected] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);
  const [isExtraExpanded, setIsExtraExpanded] = useState(false);
  // data for app
  const [map, setMap] = useState<IMap>();
  const [routes, setRoutes] = useState<IRoute[]>();
  const [updatedAt, setUpdatedAt] = useState<number>();

  const isThemeDark = useAppSelector(state => state.globalTheme.isDark);

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
        messages: route.messages,
        officialDelays: [ ],
        officialNoService: [ ],
        needToCheck: [ ],
      } as IRoute));
      let newRoutes = [...prevRoutes] // shallow copy
      alerts.forEach(alert => {
        const route = newRoutes.find(route => (route.line._id === alert.line_id));
        if (route) {
          route.messages = alert.messages;
          switch (alert.status) {
            case (Status.OfficialDelays): {
              route.officialDelays = alert.station_ids;
              break;
            }
            case (Status.OfficialNoService): {
              route.officialNoService = alert.station_ids;
              break;
            }
            case (Status.NeedToCheck): {
              route.needToCheck = alert.station_ids;
              break;
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

  useLayoutEffect(() => {
    const getLocalStorageTheme = async () => {
      const localStorageTheme = await localStorageService.getTheme();
      if (localStorageTheme === undefined) {
        if (isThemeDark) {
          setTheme.dark();
          localStorageService.setThemeDark();
        } else {
          setTheme.light();
          localStorageService.setThemeLight();
        }
      } else {
        switch (localStorageTheme) {
          case GlobalTheme.light:
            setTheme.light();
            break;
          case GlobalTheme.dark:
            setTheme.dark();
            break;
        }
      }
    }
    getLocalStorageTheme().then();
  }, []);

  useEffect(() => {
    localStorageInitializer(setMapRoutesByGetAlerts).then();
  },[]);

  const refreshButtonOnClick = () => {
    setIsLoading(true);
    setMapRoutesByGetAlerts().then();
  }

  const extraOnClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
      switch (isExtraExpanded) {
        case true:
          setIsExtraExpanded(false);
          return;
        case false:
          setIsExtraExpanded(true);
          return;
      }
}

  const resetMapOnClick = () => {
    localStorage.clear();
    window.location.reload();
  }

  const updatedAtToText = useMemo(() => epochToText(updatedAt), [updatedAt]);

  return (
    <div className=" bg-slate-200 dark:bg-slate-800 p-4">
      <div className={`max-w-sm mx-auto p-4 rounded-lg flex flex-col gap-4 ${(isConnected === undefined || isConnected === true) ? "bg-slate-100 dark:bg-slate-900" : "bg-rose-200 dark:bg-rose-900"} ${isLoading && "animate-pulse"}`}>
        <Header />
        {isConnected === false && (<Announcement message="Update failed" type={AnnouncementType.Alert} />)}
        {isLoading ? (
        <LoadingWithCircle />
        ) : (<>
        {routes?.map((route: IRoute) => (
          <DisplayRoute key={route.order} route={route} />
        ))}
        </>)}

        {!isLoading && (
          <ButtonWithTimer timer={10} onClick={refreshButtonOnClick} />
        )}
        <div>
          <div className="text-slate-500 text-sm w-full text-center">by Jonny Park | <a className="opacity-75 hover:opacity-100 hover:underline" href="https://jonpardev.github.com/tt-see">Github Repo</a></div>
          <div className={`text-black dark:text-white opacity-25 text-md text-center align-middle leading-none select-none cursor-pointer`} onClick={extraOnClick}><span className={`inline-block font-MaterialSymbols mt-2 ${isExtraExpanded && "rotate-180"}`}>expand_more</span></div>
          <SelfExpandable jsxElement={(<>
            <div className="text-slate-500 text-sm text-center opacity-50">
              <span>UpdatedAt: {!isLoading ? updatedAtToText : <span className="animate-pulse back">Loading</span>}</span><span> / </span>
              <span>MapVersion: {!isLoading ? map?._id : <span className="animate-pulse back">Loading</span>}</span><br />
            </div>
            <div className="text-slate-500 text-xs text-right mt-1 opacity-25 hover:opacity-50">
              <span className="cursor-pointer" onClick={resetMapOnClick}>ResetMap</span>
            </div>
          </>)} isExpanded={isExtraExpanded} />
        </div>
      </div>
    </div>
  );
}

export default App;
