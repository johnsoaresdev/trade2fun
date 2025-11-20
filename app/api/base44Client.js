export const base44 = {
  auth: {
    me: async () => { await sleep(100); return user },
    updateMe: async (data) => { user = {...user, ...data}; return user }
  },

  entities: {
    Trade: {
      list: async () => { await sleep(200); return trades },

      create: async (data) => {
        await sleep(200)
        const t = {
          ...data,
          id: "trade_" + (trades.length + 1),
          created_date: new Date().toISOString(),
          status: "pending"
        }
        trades.unshift(t)
        return t
      },

      // ⬇ ADICIONAR ⬇
      updateStatus: async (id, status) => {
        await sleep(200)
        const t = trades.find(tr => tr.id === id)
        if (!t) throw new Error("Trade not found")
        t.status = status
        return t
      }
    }
  }
}
