const $98 = new Proxy(
  {},
  {
    get(target: any, p: string | number | symbol, receiver: any): Promise<any> {
      const id = String(p)
      const exists = `${id}$pendingSet` in target

      if (exists) {
        return Promise.resolve(target[`${id}$pendingSet`])
      } else {
        return new Promise<any>(resolve => {
          target[`${id}$pendingGet`] = resolve
        })
      }
    },

    set(target: any, p: string | number | symbol, value: any, receiver: any): boolean {
      const id = String(p)
      const exists = `${id}$pendingGet` in target

      if (exists) {
        target[`${id}$pendingGet`](value)
      } else {
        target[`${id}$pendingSet`] = value
      }

      return true
    },
  },
)

export default $98
