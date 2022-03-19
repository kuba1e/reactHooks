import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";

const MyContext = React.createContext();

const App = () => {
  const [bgColor, setBgColor] = useState("grey");
  const [fontColor, setFontColor] = useState("blue");
  const [counter, setCount] = useState(20);
  const [show, setShow] = useState(true);

  return (
    <MyContext.Provider value={"blue"}>
      <div>
        <button
          style={{
            color: fontColor,
            backgroundColor: bgColor,
          }}
        >
          See my button
        </button>
        <div>
          <button
            onClick={() => {
              setFontColor("grey");
            }}
          >
            Set font color
          </button>
          <button
            onClick={() => {
              setBgColor("blue");
            }}
          >
            Set background color
          </button>
          <button
            onClick={() => {
              setCount((count) => count + 1);
            }}
          >
            Set count
          </button>
          <button
            onClick={() => {
              setShow((show) => !show);
            }}
          >
            Show
          </button>
        </div>
        <PlanetInfo id={counter} />
      </div>
    </MyContext.Provider>
  );
};

const Child = ({ counter, children }) => {
  const value = useContext(MyContext);

  return (
    <div
      style={{
        width: "200px",
        height: "200px",
        backgroundColor: value,
      }}
    >
      {children}
    </div>
  );
};

const Notification = () => {
  const [notific, notify] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      console.log("mount");
      return notify(false);
    }, 5000);

    return () => {
      console.log("unmount");
      return clearTimeout(id);
    };
  }, [notific]);

  return notific && <p>Hello</p>;
};

const usePlanetInfo = (id) => {
  console.log('request')
  const request = useCallback(() => getPlanet(id), [id]);
  return useRequest(request);
};

const getPlanet = (id) => {
  return fetch(`https://swapi.dev/api/planets/${id}/`)
    .then((data) => data.json())
    .then((planet) => planet.name);
};

const useRequest = (request) => {
  console.log('request to server')

  const initialState = useMemo(()=>({
    data:null,
    loading: true,
    error: null
  }), [])

  const [dataState, setDataState] = useState(initialState);

  useEffect(() => {
    setDataState(initialState)
    let cancelled = false;
    request().then((data) => {
      return !cancelled && setDataState({
        data,
        loading: false,
        error: null
      })
    }).catch(error=> !cancelled && setDataState({
      data:null,
      loading: false,
      error
    }))
    return () => (cancelled = true);
  }, [request, initialState]);

  return dataState;
};

const PlanetInfo = ({ id }) => {
  const {data, loading, error} = usePlanetInfo(id);

  console.log('mount')

  if(error){
    return <div>Something is wrong</div>
  }
  if(loading){
    return <p>loading</p>
  }

  return (
    <p>
      {id} - Planet Name: {data}
    </p>
  );
};

export default App;
