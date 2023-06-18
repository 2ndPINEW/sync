function Preview({ clientId, logId }: { clientId: string; logId: string }) {
  return (
    <>
      <img
        src={`http://localhost:4636/__browser-tester-static/${clientId}/${logId}.png`}
        style={{ width: "100%" }}
        loading="lazy"
      ></img>
    </>
  );
}

export default Preview;
