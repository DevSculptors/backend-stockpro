import { Express, Request, Response } from "express";

function personRoutes(app: Express): void {

  /**
   * @openapi
   * /test:
   *  get:
   *     tags:
   *     - Test
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/test", (req: Request, res: Response) => res.sendStatus(200));

}

export default personRoutes;