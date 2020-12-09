const { log } = console

const $99 = new Proxy(
  {},
  {
    get(target: any, p: string | number | symbol, receiver: any): (value?: any) => Promise<void | any> {
      const id = String(p)

      const setter = async (value: any): Promise<void> => {
        const getterWaiting = `${id}$pendingGet$resolve` in target
        // log(`setter: getterWaiting ${getterWaiting}`)

        if (getterWaiting) {
          const resolve = target[`${id}$pendingGet$resolve`]
          delete target[`${id}$pendingGet$resolve`]
          resolve(value)
        } else {
          await new Promise<any>(resolve => {
            target[`${id}$pendingSet$resolve`] = resolve
            target[`${id}$pendingSet$value`] = value
          })
          // log(`setter: getter done! (setter done)`)
        }
      }

      const getter = async (): Promise<any> => {
        const setterWaiting = `${id}$pendingSet$resolve` in target
        // log(`getter: setterWaiting ${setterWaiting}`)

        if (setterWaiting) {
          const resolve = target[`${id}$pendingSet$resolve`]
          const value = target[`${id}$pendingSet$value`]
          delete target[`${id}$pendingSet$resolve`]
          delete target[`${id}$pendingSet$value`]

          try {
            return Promise.resolve(value)
          } finally {
            resolve()
          }
        } else {
          return new Promise<any>(resolve => {
            target[`${id}$pendingGet$resolve`] = resolve
          })
        }
      }

      return (value?: any): Promise<void | any> => (value === undefined ? getter() : setter(value))
    },
  },
)

export default $99
