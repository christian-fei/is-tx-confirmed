const https = require('https')

module.exports = {
  getLTCAddress,
  getConfirmations,
  isConfirmed
}

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
      .on('error', (err) => { /* istanbul ignore next */
        console.error(err) /* istanbul ignore next */
        reject(err)
      })
  })
}

async function getConfirmations (address) {
  const body = await getLTCAddress(address)
  if (body.includes('num-confs')) {
    const match = body.match(/num-confs">(\d+)/) /* istanbul ignore next */
    if (!match) return 0
    const confirmations = match[1]
    return confirmations
  }
}

async function isConfirmed (address) {
  const confirmations = await getConfirmations(address)
  return confirmations >= 6
}
