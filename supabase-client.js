/* Client-side configuration: publishable keys are safe only with RLS enabled. */
(function initSupabaseClient() {
  const projectUrl = 'https://skzvmjocbwdboxvqvngc.supabase.co';
  const publishableKey = 'sb_publishable_vOCGndJeXVsCRdYKnWmjvg_XRQS9pBk';

  if (!window.supabase?.createClient) {
    console.error('Supabase JS não foi carregado.');
    return;
  }

  window.appSupabase = window.supabase.createClient(projectUrl, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit'
    }
  });

  // Convites e recuperações podem retornar para a landing page. Preserve o hash
  // e leve o usuário para o fluxo correto, sem expor o token em outra tela.
  const isInvite = /(?:^|[#&])type=invite(?:&|$)/.test(window.location.hash);
  const isRecovery = /(?:^|[#&])type=recovery(?:&|$)/.test(window.location.hash);
  const isAdminPage = /\/admin\.html(?:$|[?#])/.test(window.location.pathname);
  if ((isInvite || isRecovery) && !isAdminPage) {
    const target = new URL('admin.html', window.location.href);
    target.searchParams.set('next', 'pedidos.html');
    target.hash = window.location.hash.slice(1);
    window.location.replace(target.href);
  }
})();
