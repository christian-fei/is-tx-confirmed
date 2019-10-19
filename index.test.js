const { test } = require('tap')
const https = require('https')

test('true if tx is confirmed', async t => {
  const confirmed = await isConfirmed('57fafe15fcca248ea56331069f5002b4d1611e37a5ad0095a70e645935699b35')
  t.ok(confirmed)
  t.end()
})

test('false if tx is not confirmed', async t => {
  const confirmed = await isConfirmed('3446102f825d4c5706760592a4709cee69b410eef4a95e64fc6bec5ac7f7b37b')
  t.notOk(confirmed)
  t.end()
})

async function getLTCAddress (address) {
  return new Promise((resolve, reject) => {
    https.get(`https://live.blockcypher.com/ltc/tx/${address}/`, (res) => {
      const buffer = []
      res.on('data', d => buffer.push(d))
      res.on('end', () => {
        const string = Buffer.concat(buffer).toString('utf8')
        resolve(string)
      })
    })
      .on('error', (err) => {
        console.error(err)
        reject(err)
      })
  })
}

async function getConfirmations (address) {
  const body = await getLTCAddress(address)
  if (body.includes('num-confs')) {
    const match = body.match(/num-confs">(\d+)/)
    if (!match) return false
    const confirmations = match[1]
    return confirmations
  }
}

async function isConfirmed (address) {
  const confirmations = await getConfirmations(address)
  return confirmations >= 6
}
