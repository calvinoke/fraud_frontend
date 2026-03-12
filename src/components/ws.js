export const connectWebSocket = (onMessage) => {
  const ws = new WebSocket("ws://localhost:8000/ws");

  ws.onopen = () => console.log("WebSocket connected");
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  ws.onclose = () => console.log("WebSocket disconnected");
  ws.onerror = (err) => console.error("WebSocket error:", err);

  return ws;
};