import { useQuery } from "@tanstack/react-query";

type Client = {
  id: string;
  platformInfo: {
    os: string;
    browser: string;
    version: string;
    screen: {
      width: number;
      height: number;
    };
    language: string;
  };
  lastActiveAt: number;
  idleLogs: IdleLog[];
};

type IdleLog = {
  type: string;
  id: string;
  clientId: string;
  path: string;
  html: string | null;
  screenshot: string | null;
};

type PathGroupedInfo = {
  path: string;
  infos: Client[];
};

const getClients = async (): Promise<PathGroupedInfo[]> => {
  const res = await fetch("http://localhost:4637/clients", {
    method: "GET",
  });
  const json = await res.json();
  const pathGroupedInfo: PathGroupedInfo[] = [];

  json.forEach((client: Client) => {
    client.idleLogs.forEach((log: IdleLog) => {
      const path = log.path;
      const pathGroupedInfoIndex = pathGroupedInfo.findIndex(
        (info) => info.path === path
      );
      if (pathGroupedInfoIndex === -1) {
        pathGroupedInfo.push({
          path,
          infos: [client],
        });
      } else {
        pathGroupedInfo[pathGroupedInfoIndex].infos.push(client);
      }
    });
  });
  console.log(pathGroupedInfo);
  return pathGroupedInfo;
};

export const useFetchClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      return await getClients();
    },
    cacheTime: 0,
  });
};
