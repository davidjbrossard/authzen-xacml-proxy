import express, { Response } from 'express'
import { Request as JWTRequest } from 'express-jwt'
import cors from 'cors'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import { AuthZenRequest } from './interface'
import { Attribute } from "xacml/Attribute";
import { Category } from "xacml/Category";
import { Request as xacmlRequest, RequestWrapper } from "xacml/Request"
import { Response as xacmlResponse } from "xacml/Response";
dotenvExpand.expand(dotenv.config())

const app: express.Application = express()
app.use(express.json())
app.use(cors())


const PORT = 8080

const pathMappings: Record<string, string> = {
  can_read_user: 'todoApp.GET.users.__userID',
  can_read_todos: 'todoApp.GET.todos',
  can_create_todo: 'todoApp.POST.todos',
  can_update_todo: 'todoApp.PUT.todos.__id',
  can_delete_todo: 'todoApp.DELETE.todos.__id',
}

app.post('/access/v1/evaluations', async (req: JWTRequest, res: Response) => {
  const authzRequest: AuthZenRequest = req.body
  const identity = authzRequest.subject?.identity
  const policyPath = pathMappings[authzRequest?.action?.name]
  const ownerID = authzRequest.resource?.ownerID
  let decision = false
  if (identity && policyPath) {
    try {
      let r : xacmlRequest = new xacmlRequest();
      let subject : Category = new Category();
      subject.Attribute = [];
      let action : Category = new Category();
      let resource : Category = new Category();
      // 1. Add subject
      r.AccessSubject = [];
      for (const [key, value] of Object.entries(authzRequest.subject)) {
        subject.Attribute.push(new Attribute(key,value));
      }
      r.AccessSubject.push(subject);
      // 2. Add action
      r.Action = [];
      r.Action.push(action);
      // 3. Add resource
      r.Resource = [];
      r.Resource.push(resource);
    } catch (e) {
      console.error(e)
    }
  }

  const response = JSON.stringify({
    decision,
  })

  res.status(200).send(response)
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})
