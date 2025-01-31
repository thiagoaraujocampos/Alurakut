import { useEffect, useState } from 'react';
import nookies from 'nookies'

import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      
      <hr />
      <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
        @{propriedades.githubUser}
      </a>
      <hr />
      
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>

      <ul>
        {
          props.items.map((itemAtual, index) => {
            if(index < 6) {
              return (
                <li key={itemAtual.id}>
                  <a href={`https://github.com/${itemAtual.login}`} >
                    <img src={itemAtual.avatar_url} />
                    <span>{itemAtual.login}</span>
                  </a>
                </li>
              )
            }
            return;
          })
        }
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const [comunidades, setComunidades] = useState([])
  const [seguidores, setSeguidores] = useState([])
  const [seguidos, setSeguidos] = useState([])
  const [name, setName] = useState('')
  const user = JSON.parse(props.currentUser)

  const githubUser = user.username;

  useEffect(() => {
    fetch(`https://api.github.com/users/${user.username}`)
      .then((response) => response.json())
      .then((response) => setName(response.name));

    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((response) => response.json())
      .then((response) => setSeguidores(response))

    fetch(`https://api.github.com/users/${githubUser}/following`)
      .then((response) => response.json())
      .then((response) => setSeguidos(response))

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '77ec12f944e7e1e2cf3ccd6454a9ef',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `
        query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }
      `})
    })
    .then((response) => response.json())
    .then((response) => { setComunidades(response.data.allCommunities) })
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={githubUser}/>
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a), <br />
              {name}
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);
                
                const comunidade = {
                  title: dadosDoForm.get('title'),
                  imageUrl: dadosDoForm.get('image'),
                  creatorSlug: githubUser,
                }

                document.querySelector('input[name="title"]').value = '';
                document.querySelector('input[name="image"]').value = '';



                fetch('/api/comunidades', { 
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade),
                })
                  .then(async (response) => {
                    const dados = await response.json();
                    const comunidade = dados.registroCriado;
                    setComunidades([...comunidades, comunidade]);
                  })
              }}
            >

              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?"  
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                  autocomplete="off"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa"  
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type="text"
                  autocomplete="off"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox title="Seguidores" items={seguidores} /> 
          
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Minhas comunidades ({comunidades.length})
            </h2>

            <ul>
              {
                comunidades.map((itemAtual, index) => {
                  if(index < 6) {
                    return (
                      <li key={itemAtual.id}>
                        <a href={`/communities/${itemAtual.id}`} >
                          <img src={itemAtual.imageUrl} />
                          <span>{itemAtual.title}</span>
                        </a>
                      </li>
                    )
                  }
                  return;
                })
              }
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBox title="Pessoas da comunidade" items={seguidos} /> 
          
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const currentUser = nookies.get(context).CURRENT_USER;

  if(!currentUser) {
    nookies.destroy('CURRENT_USER')
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return {
    props: {
      currentUser,
    },
  }
}
