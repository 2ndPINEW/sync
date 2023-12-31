import "./index.css";
import { fetchStart, useFetchClients } from "../../hooks/core/useFetch";
import Preview from "./_components/preview";

function Home() {
  const { data } = useFetchClients();

  const handleStart = () => {
    fetchStart();
  };

  return (
    <>
      <button
        style={{
          borderRadius: "8px",
          padding: "8px 16px",
        }}
        onClick={handleStart}
      >
        Start
      </button>
      {data?.map((path) => (
        <div
          key={path.path}
          style={{
            display: "flex",
            gap: "32px",
          }}
        >
          <h2>{path.path}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "8px",
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
