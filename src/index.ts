import express, { Response } from 'express'
import { Request as JWTRequest } from 'express-jwt'
import cors from 'cors'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import { getConfig } from './config'
import {Request as axio } from '@axiomatics/xacml-node'
import { AuthZenRequest } from './interface'
dotenvExpand.expand(dotenv.config())

const app: express.Application = express()
app.use(express.json())
app.use(cors())

const authzOptions = getConfig()

const PORT = authzOptions.port ?? 8080

const pathMappings: Record<string, string> = {
  can_read_user: 'todoApp.GET.users.__userID',
  can_read_todos: 'todoApp.GET.todos',
  can_create_todo: 'todoApp.POST.todos',
  can_update_todo: 'todoApp.PUT.todos.__id',
  can_delete_todo: 'todoApp.DELETE.todos.__id',
}

const instanceName = authzOptions.instanceName || 'todo'
const instanceLabel = authzOptions.instanceLabel || 'todo'

app.post('/access/v1/evaluations', async (req: JWTRequest, res: Response) => {
  const request: AuthZenRequest = req.body
  const identity = request.subject?.identity
  const policyPath = pathMappings[request?.action?.name]
  const ownerID = request.resource?.ownerID
  let decision = false
  if (identity && policyPath) {
    try {
      let r : axio.Request = new axio.Request();
      let c : axio.Category = new axio.Category();
      r.add
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
