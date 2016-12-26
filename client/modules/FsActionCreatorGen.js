const APP_NAME = 'hatu'

export const getActionNameGen = moduleName => actionName => (
  [APP_NAME, moduleName, actionName].join('/')
)

/* This type comes from flux standard action spec
 * see details: https://github.com/acdlite/flux-standard-action#readme
 */
export const FSActionCreatorGen = type => payload => {
  const action = { type, payload }
  if (payload instanceof Error) {
    action.error = true
  }
  return action
}
