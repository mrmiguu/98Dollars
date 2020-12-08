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

test("reusable bi-directional IO", async () => {
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
