import { handleAdmin, type Env } from "../../../server/api"
import { githubStorage } from "../../../server/github"
import deployment from "../../../server/deployment.json"

export const onRequest = ({ request, env }: { request: Request; env: Env }) => handleAdmin(request, env, githubStorage({ ...env, CF_PAGES_BRANCH: deployment.branch || env.CF_PAGES_BRANCH }))
