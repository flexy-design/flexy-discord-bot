import express from "express";

export const registerHealthCheck = () => {
  return new Promise<() => unknown>((resolve) => {
    const app = express();
    const sever = app.listen(4000, () => resolve(() => sever.close()));

    app.get("/health", (req, res) => {
      res.send("ok");
    });
  });
};
