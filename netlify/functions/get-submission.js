// node 18+ pour netlify functions
const fetch = require('node-fetch')
exports.handler = async function(event, context){
  const siteId = process.env.SITE_ID
  const token = process.env.NETLIFY_TOKEN
  if(!siteId || !token) return { statusCode:500, body: JSON.stringify({error:'Missing SITE_ID or NETLIFY_TOKEN in env'}) }
  try{
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/submissions`, { headers:{ Authorization: 'Bearer '+token } })
    const data = await res.json()
    return { statusCode:200, body: JSON.stringify(data) }
  }catch(e){ return { statusCode:500, body: JSON.stringify({error:e.message}) } }
}
