const fetch = require('node-fetch')
exports.handler = async function(event, context){
  const token = process.env.NETLIFY_TOKEN
  const siteId = process.env.SITE_ID
  if(!token) return { statusCode:500, body: JSON.stringify({error:'Missing token'}) }

  const params = event.queryStringParameters || {}
  try{
    if(params.delete_all){
      // delete the form (all submissions)
      const r = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms/eds-contact`, { method:'DELETE', headers:{ Authorization: 'Bearer '+token } })
      const json = await r.json()
      return { statusCode:200, body: JSON.stringify(json) }
    }
    if(params.submission_id){
      const id = params.submission_id
      const r = await fetch(`https://api.netlify.com/api/v1/submissions/${id}`, { method:'DELETE', headers:{ Authorization: 'Bearer '+token } })
      if(r.status === 204) return { statusCode:200, body: JSON.stringify({ok:true}) }
      const json = await r.json()
      return { statusCode:r.status, body: JSON.stringify(json) }
    }
    return { statusCode:400, body: JSON.stringify({error:'no action'}) }
  }catch(e){ return { statusCode:500, body: JSON.stringify({error:e.message}) } }
}
