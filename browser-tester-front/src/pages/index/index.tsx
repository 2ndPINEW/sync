import "./index.css";
import { useFetchClients } from "../../hooks/core/useFetch";
import Preview from "./_components/preview";

function Home() {
  const { data } = useFetchClients();
  return (
    <>
      {data?.map((path) => (
        <div
          key={path.path}
          style={{
            display: "flex",
          }}
        >
          <div>{path.path}</div>
          <div
            style={{
              display: "flex",
            }}
          >
            {path.infos.map((info) => (
              <div>
                <div>{info.platformInfo.os}</div>
                <div>{info.platformInfo.browser}</div>
                <div>{info.platformInfo.version}</div>
                <Preview clientId={info.clientId} logId={info.logId}></Preview>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default Home;
