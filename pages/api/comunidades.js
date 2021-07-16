import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequests(request, response) {
  if(request.method === 'POST') {
    const TOKEN = '62b2d265cf0623b4ee52cffe8810b9'
    const client = new SiteClient(TOKEN)

    const registroCriado = client.items.create({
      itemType: "973875",
      ...request.body,
      // title: "Comunidade",
      // imageUrl: "https://github.com/omariosouto.png",
      // creatorSlug: "omariosouto",
    })

    response.json({
      registroCriado: registroCriado,
    })

    return
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem!'
  })

}