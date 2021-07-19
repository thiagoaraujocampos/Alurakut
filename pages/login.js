import React from 'react';
import { useRouter } from 'next/router';
import { FaGithub } from 'react-icons/fa';

import { useAuth } from '../src/hooks/useAuth'; 


export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = React.useState('');

  const { user, signin } = useAuth();
  
  function getName() {
    if(user) {
      fetch(`https://api.github.com/users/${user.username}`)
        .then((response) => response.json())
        .then((response) => setName(response.name));
    }
    return name;
  }

  async function onLogin() {
    if(!user) {
      await signin()
    }

    router.push('/');
  }

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form className="box">
            <p>
              Acesse agora mesmo com seu usuário do <strong>Github</strong>!
            </p>
            <button type="button" onClick={onLogin} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginTop: 20,
              padding: 12,
              backgroundColor: '#1B1E23',
            }}>
              <FaGithub size={'1.6rem'} style={{marginRight: 14 }} />
              <strong>{user ? getName() : 'Login com Github'}</strong>
            </button>
          </form>

          <footer className="box">
            <p style={{margin: 20}}>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>
                  ENTRAR JÁ
                </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
} 