/* Shared Discord navbar authentication for public pages. */
(() => {
  const SUPABASE_URL = 'https://uwtvgpeijygvjpcifkew.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_xA3go5xRhg62NnEELn3I6Q_kCk54JuZ';
  document.addEventListener('DOMContentLoaded', async () => {
    const login = document.getElementById('discordLoginBtn');
    const logout = document.getElementById('discordLogoutBtn');
    const profile = document.getElementById('memberProfile');
    const name = document.getElementById('memberName');
    const avatar = document.getElementById('memberAvatar');
    const memberLink = document.getElementById('memberPortalLink');
    const adminLink = document.getElementById('adminPortalLink');
    if (!login || !profile || !window.supabase) return;
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    async function render(session) {
      const user = session?.user;
      login.hidden = !!user;
      profile.hidden = !user;
      if (memberLink) memberLink.hidden = true;
      if (adminLink) adminLink.hidden = true;
      if (!user) return;
      const metadata = user.user_metadata || {};
      const displayName = metadata.global_name || metadata.full_name || metadata.name || metadata.user_name || metadata.preferred_username || user.email || 'Member';
      if (name) name.textContent = displayName;
      const url = metadata.avatar_url || metadata.picture;
      if (avatar) {
        avatar.hidden = !url;
        if (url) { avatar.src = url; avatar.alt = displayName + ' Discord avatar'; }
      }
      try {
        const { data, error } = await client.from('member_profiles')
          .select('display_name,access_level,member_status')
          .eq('user_id',user.id).maybeSingle();
        if (error || !data) return;
        if (name) name.textContent = data.display_name || displayName;
        if (memberLink) memberLink.hidden = false;
        if (adminLink) adminLink.hidden = !['Admin','Super Admin'].includes(data.access_level);
      } catch (e) { console.error('Navbar profile lookup failed:', e); }
    }
    login.addEventListener('click', async () => {
      const { error } = await client.auth.signInWithOAuth({
        provider:'discord',
        options:{redirectTo:window.location.href}
      });
      if (error) alert('Discord login failed: ' + error.message);
    });
    logout?.addEventListener('click', async () => {
      await client.auth.signOut();
      await render(null);
    });
    try {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      await render(data.session);
    } catch(e) { console.error('Discord session restore failed:',e); }
    client.auth.onAuthStateChange((event,session) => {
      setTimeout(() => { render(session); },0);
    });
  });
})();
