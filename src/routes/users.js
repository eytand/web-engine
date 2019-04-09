import { makeInvoker } from "awilix-koa"

/**
 * This is an example router with an injected service
 * Please make sure makeInvoker is being used. see {@link https://github.com/jeffijoe/awilix-koa}
 * @param {usersService} 
 */
function makeAPI({ usersService }) {
  return {
    find: ctx => {
      ctx.body = JSON.stringify(usersService.get(ctx.params.id))
    },
    create: ctx => {
      ctx.body = usersService.create(ctx.request.body)
    }
  }
}

export function init(router) {
  const api = makeInvoker(makeAPI)
  // Creates middleware that will invoke `makeAPI`
  // for each request, giving you a scoped instance.  
  router.get('/users/:id', api('find'))
  router.post('/users', api('create'))
}