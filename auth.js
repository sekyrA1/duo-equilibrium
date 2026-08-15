(function setupAdminAuth() {
  const loginForm = document.getElementById('loginForm');
  const inviteForm = document.getElementById('inviteForm');
  const message = document.getElementById('authMessage');
  const submitLogin = document.getElementById('submitLogin');
  const submitInvite = document.getElementById('submitInvite');
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next') || 'pedidos.html';
  const inviteInHash = /(?:^|[#&])type=invite(?:&|$)/.test(window.location.hash);

  const setMessage = (text, type = '') => {
    message.textContent = text;
    message.dataset.type = type;
  };

  const isAllowed = profile => profile?.active && ['admin', 'sales', 'factory', 'viewer'].includes(profile.role);

  async function profileFor(session) {
    const { data, error } = await window.appSupabase
      .from('profiles')
      .select('id, display_name, role, active')
      .eq('id', session.user.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  function redirectAfterAuth() {
    window.location.assign(next);
  }

  async function handleSession(session) {
    if (!session) return false;
    try {
      const profile = await profileFor(session);
      if (!isAllowed(profile)) {
        await window.appSupabase.auth.signOut();
        setMessage('Seu usuário ainda não tem permissão para acessar o painel.', 'error');
        return false;
      }

      if (inviteInHash) {
        loginForm.hidden = true;
        inviteForm.hidden = false;
        document.getElementById('inviteEmail').textContent = session.user.email || '';
        setMessage('Convite confirmado. Defina uma senha para continuar.', 'success');
      } else {
        redirectAfterAuth();
      }
      return true;
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível carregar seu perfil. Tente novamente.', 'error');
      return false;
    }
  }

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    submitLogin.disabled = true;
    setMessage('Validando acesso…');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const { data, error } = await window.appSupabase.auth.signInWithPassword({ email, password });
    if (error) {
      submitLogin.disabled = false;
      setMessage('E-mail ou senha inválidos, ou convite ainda não confirmado.', 'error');
      return;
    }
    await handleSession(data.session);
    submitLogin.disabled = false;
  });

  inviteForm.addEventListener('submit', async event => {
    event.preventDefault();
    submitInvite.disabled = true;
    const password = document.getElementById('invitePassword').value;
    const confirmation = document.getElementById('invitePasswordConfirmation').value;
    if (password.length < 8 || password !== confirmation) {
      submitInvite.disabled = false;
      setMessage('Use pelo menos 8 caracteres e repita a mesma senha.', 'error');
      return;
    }
    const { error } = await window.appSupabase.auth.updateUser({ password });
    if (error) {
      submitInvite.disabled = false;
      setMessage('Não foi possível definir a senha. Tente novamente.', 'error');
      return;
    }
    window.history.replaceState({}, document.title, window.location.pathname);
    setMessage('Senha criada. Abrindo o painel…', 'success');
    window.setTimeout(redirectAfterAuth, 400);
  });

  if (!window.appSupabase) {
    setMessage('Não foi possível carregar a conexão segura.', 'error');
    return;
  }

  if (params.get('reason') === 'permission') setMessage('Sua sessão não tem permissão para acessar essa área.', 'error');
  window.appSupabase.auth.getSession().then(({ data: { session } }) => handleSession(session));
})();
