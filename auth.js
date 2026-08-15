(function setupAdminAuth() {
  const loginForm = document.getElementById('loginForm');
  const recoveryForm = document.getElementById('recoveryForm');
  const inviteForm = document.getElementById('inviteForm');
  const resetForm = document.getElementById('resetForm');
  const message = document.getElementById('authMessage');
  const submitLogin = document.getElementById('submitLogin');
  const submitRecovery = document.getElementById('submitRecovery');
  const submitInvite = document.getElementById('submitInvite');
  const submitReset = document.getElementById('submitReset');
  const showRecovery = document.getElementById('showRecovery');
  const backToLogin = document.getElementById('backToLogin');
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next') || 'pedidos.html';
  const inviteInHash = /(?:^|[#&])type=invite(?:&|$)/.test(window.location.hash);
  const recoveryInHash = /(?:^|[#&])type=recovery(?:&|$)/.test(window.location.hash);

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

  function showOnly(form) {
    [loginForm, recoveryForm, inviteForm, resetForm].forEach(item => {
      item.hidden = item !== form;
    });
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
        showOnly(inviteForm);
        document.getElementById('inviteEmail').textContent = session.user.email || '';
        setMessage('Convite confirmado. Defina uma senha para continuar.', 'success');
      } else if (recoveryInHash) {
        showOnly(resetForm);
        setMessage('Link confirmado. Defina uma nova senha.', 'success');
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

  showRecovery.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    document.getElementById('recoveryEmail').value = email;
    showOnly(recoveryForm);
    setMessage('');
  });

  backToLogin.addEventListener('click', () => {
    showOnly(loginForm);
    setMessage('');
  });

  recoveryForm.addEventListener('submit', async event => {
    event.preventDefault();
    submitRecovery.disabled = true;
    setMessage('Enviando link seguro…');
    const email = document.getElementById('recoveryEmail').value.trim();
    const redirectTo = new URL('admin.html', window.location.href);
    redirectTo.search = '';
    redirectTo.searchParams.set('mode', 'reset');
    redirectTo.searchParams.set('next', next);
    const { error } = await window.appSupabase.auth.resetPasswordForEmail(email, { redirectTo: redirectTo.href });
    submitRecovery.disabled = false;
    if (error) {
      console.error(error);
      if (error.status === 429 || /rate.?limit|too many/i.test(error.message || '')) {
        setMessage('O Supabase atingiu o limite temporário de e-mails. Use o link mais recente ou aguarde antes de solicitar outro.', 'error');
        return;
      }
      setMessage('Não foi possível enviar o link. Confira o e-mail e tente novamente.', 'error');
      return;
    }
    setMessage('Link enviado. Verifique sua caixa de entrada e também a pasta de spam.', 'success');
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

  resetForm.addEventListener('submit', async event => {
    event.preventDefault();
    submitReset.disabled = true;
    const password = document.getElementById('resetPassword').value;
    const confirmation = document.getElementById('resetPasswordConfirmation').value;
    if (password.length < 8 || password !== confirmation) {
      submitReset.disabled = false;
      setMessage('Use pelo menos 8 caracteres e repita a mesma senha.', 'error');
      return;
    }
    const { error } = await window.appSupabase.auth.updateUser({ password });
    if (error) {
      submitReset.disabled = false;
      console.error(error);
      setMessage('O link expirou ou não é mais válido. Solicite outro link.', 'error');
      return;
    }
    window.history.replaceState({}, document.title, `${window.location.pathname}?next=${encodeURIComponent(next)}`);
    setMessage('Senha atualizada. Abrindo o painel…', 'success');
    window.setTimeout(redirectAfterAuth, 500);
  });

  if (!window.appSupabase) {
    setMessage('Não foi possível carregar a conexão segura.', 'error');
    return;
  }

  if (params.get('reason') === 'permission') setMessage('Sua sessão não tem permissão para acessar essa área.', 'error');
  if (params.get('reason') === 'session') setMessage('Sua sessão expirou. Entre novamente ou recupere sua senha.', 'error');
  window.appSupabase.auth.getSession().then(({ data: { session } }) => handleSession(session));
})();
