import $99 from "."

test("basic IO", async () => {
  $99.Abc("abc")
  const abc = await $99.Abc()
  expect(abc).toBe("abc")
})

test("basic IO with keyed path", async () => {
  const path1 = "this is some path"

  $99[path1]("my value")
  const myValue = await $99[path1]()

  expect(myValue).toBe("my value")
})

test("blocking input", async () => {
  const abcOut = jest.fn()
  $99.Abc("abc").then(abcOut)
  expect(abcOut).not.toHaveBeenCalled()
})

test("blocking output", async () => {
  const abcIn = jest.fn()
  $99.Abc().then(abcIn)
  expect(abcIn).not.toHaveBeenCalled()
})

test("asynchronous IO", async () => {
  return Promise.all([
    (async () => {
      const xyz = await $99.NotAbc()
      expect(xyz).toBe("xyz")
    })(),

    (async () => {
      await $99.NotAbc("xyz")
    })(),
  ])
})

test("callback-like behavior", async () => {
  return Promise.all([
    (async () => {
      const one = await $99.Callback1()
      const two = await $99.Callback1()
      const three = await $99.Callback1()
      expect(one).toBe(1)
      expect(two).toBe(2)
      expect(three).toBe(3)
    })(),

    (async () => {
      await $99.Callback1(1)
      await $99.Callback1(2)
      await $99.Callback1(3)
    })(),
  ])
})

test("forced asynchronous IO", async () => {
  return Promise.all([
    (async () => {
      await $99.Hi("hi")
      const notHi = await $99.Hi()
      expect(notHi).not.toBe("hi")
    })(),

    (async () => {
      const hi = await $99.Hi()
      expect(hi).toBe("hi")
      await $99.Hi("not hi")
    })(),
  ])
})

test("dynamically-typed IO", async () => {
  return Promise.all([
    (async () => {
      const abc = await $99.TestBoth()
      expect(abc).toBe("abc")

      await $99.TestBoth(123)
    })(),

    (async () => {
      await $99.TestBoth("abc")

      const n = await $99.TestBoth()
      expect(n).toBe(123)
    })(),
  ])
})

test("reusable IO", async () => {
  return Promise.all([
    (async () => {
      const abc = await $99.FreshMsg()
      expect(abc).toBe("abc")

      await $99.FreshMsg(123)

      const xyz = await $99.FreshMsg()
      expect(xyz).toBe("xyz")

      await $99.FreshMsg(789)
    })(),

    (async () => {
      await $99.FreshMsg("abc")

      const n = await $99.FreshMsg()
      expect(n).toBe(123)

      await $99.FreshMsg("xyz")

      const m = await $99.FreshMsg()
      expect(m).toBe(789)
    })(),
  ])
})

test("passing state separately", async () => {
  return Promise.all([
    (async () => {
      await $99.A(1)

      let count = await $99.B()
      expect(count).toBe(2)
    })(),

    (async () => {
      let count = await $99.A()
      expect(count).toBe(1)

      await $99.B(count + 1)
    })(),
  ])
})

test("passing state through one channel", async () => {
  return Promise.all([
    (async () => {
      await $99.One(1)

      let count = await $99.One()
      expect(count).toBe(2)
    })(),

    (async () => {
      let count = await $99.One()
      expect(count).toBe(1)

      await $99.One(count + 1)
    })(),
  ])
})

test("passing a lot of state", async () => {
  const n = 100

  return Promise.all([
    (async () => {
      let b

      await $99.A(1)

      for (let i = 1; i <= n; i++) {
        b = await $99.B()
        expect(b).toBe(2 * i)

        if (i < n) {
          await $99.A(b + 1)
        }
      }
      expect(b).toBe(2 * n)
    })(),

    (async () => {
      let a

      for (let i = 1; i <= n; i++) {
        a = await $99.A()
        expect(a).toBe(2 * i - 1)

        await $99.B(a + 1)
      }
      expect(a).toBe(2 * n - 1)
    })(),
  ])
})
