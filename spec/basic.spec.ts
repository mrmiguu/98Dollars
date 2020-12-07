import $98 from "../src"

test("basic input/output", async () => {
  $98.Test = "abc"
  const abc = await $98.Test

  expect(abc).toBe("abc")
})

test("asynchronous input/output", async () => {
  ;(async () => {
    const xyz = await $98.Xyz
    expect(xyz).toBe("xyz")
  })()
  ;(async () => {
    $98.Xyz = "xyz"
  })()
})

test("reusable input/output", async () => {
  ;(async () => {
    let msg = await $98.Msg
    expect(msg).toBe("abc")

    msg = await $98.Msg
    expect(msg).toBe("xyz")
  })()
  ;(async () => {
    $98.Msg = "abc"
    $98.Msg = "xyz"
  })()
})

test("dynamic input/output data types", async () => {
  ;(async () => {
    let msg = await $98.Msg
    expect(msg).toBe("abc")

    msg = await $98.Msg
    expect(msg).toBe(123)
  })()
  ;(async () => {
    $98.Msg = "abc"
    $98.Msg = 123
  })()
})

test("bi-directional input/output", async () => {
  ;(async () => {
    const abc = await $98.Msg
    expect(abc).toBe("abc")

    $98.Msg = 123
  })()
  ;(async () => {
    $98.Msg = "abc"

    const n = await $98.Msg
    expect(n).toBe(123)
  })()
})
