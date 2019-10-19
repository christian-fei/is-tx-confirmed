const { test } = require('tap')
const { isConfirmed } = require('.')

test('true if tx is confirmed', async t => {
  const confirmedTx = '57fafe15fcca248ea56331069f5002b4d1611e37a5ad0095a70e645935699b35'
  const confirmed = await isConfirmed(confirmedTx)
  t.ok(confirmed)
  t.end()
})

test('false if tx is not confirmed', async t => {
  const unconfirmedTx = '3446102f825d4c5706760592a4709cee69b410eef4a95e64fc6bec5ac7f7b37b'
  const confirmed = await isConfirmed(unconfirmedTx)
  t.notOk(confirmed)
  t.end()
})
