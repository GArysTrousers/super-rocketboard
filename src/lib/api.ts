export async function api<T = any>(url: string, body = {}, fetchMethod = fetch): Promise<T> {
  return await fetchMethod(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(async (t) =>  {
    if (t.status == 200) return await t.json()
    else throw new Error(t.status.toString())
  })

}