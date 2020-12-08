import $98 from "."

test("basic IO", async () => {
  $98.Test = "abc"
  const abc = await $98.Test

  expect(abc).toBe("abc")
})

test("asynchronous IO", async () => {
  return Promise.all([
    (async () => {
      const xyz = await $98.Xyz
      expect(xyz).toBe("xyz")
    })(),

    (async () => {
      $98.Xyz = "xyz"
    })(),
  ])
})

test("bi-directional IO", async () => {
  return Promise.all([
    (async () => {
      const abc = await $98.Msg
      expect(abc).toBe("abc")

      $98.Msg = 123
    })(),

    (async () => {
      $98.Msg = "abc"

      const n = await $98.Msg
      expect(n).toBe(123)
    })(),
  ])
})

test("reusable IO", async () => {
  return Promise.all([
    (async () => {
      const abc = await $98.Msg
      expect(abc).toBe("abc")

      $98.Msg = 123

      const xyz = await $98.Msg
      expect(xyz).toBe("xyz")

      $98.Msg = 789
    })(),

    (async () => {
      $98.Msg = "abc"

      const n = await $98.Msg
      expect(n).toBe(123)

      $98.Msg = "xyz"

      const m = await $98.Msg
      expect(m).toBe(789)
    })(),
  ])
})

test("passing state back-and-forth", async () => {
  return Promise.all([
    (async () => {
      $98.A = 1
      let count = await $98.B
      expect(count).toBe(2)
    })(),

    (async () => {
      let count = await $98.A
      expect(count).toBe(1)
      $98.B = count + 1
    })(),
  ])
})

test("passing a lot of state", async () => {
  return Promise.all([
    (async () => {
      let b
      $98.A = 1
      for (let i = 1; i <= 10; i++) {
        b = await $98.B
        $98.A = b + 1
      }
      expect(b).toBe(10)
    })(),

    (async () => {
      let a
      for (let i = 1; i <= 10; i++) {
        a = await $98.A
        $98.B = a + 1
      }
      expect(a).toBe(9)
    })(),
  ])
})

test("passing a ton of state", async () => {
  const n = 100
  return Promise.all([
    (async () => {
      let d
      $98.C = 1
      for (let i = 1; i <= n; i++) {
        d = await $98.D
        $98.C = d + 1
      }
      expect(d).toBe(n)
    })(),

    (async () => {
      let c
      for (let i = 1; i <= n; i++) {
        c = await $98.C
        $98.D = c + 1
      }
      expect(c).toBe(n - 1)
    })(),
  ])
})
