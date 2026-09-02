// =========================================================
// 21ST CAVALRY DIVISION
// WEBSITE JAVASCRIPT
// =========================================================


// =========================================================
// MOBILE NAVIGATION
// =========================================================

const toggle =
    document.querySelector('.nav-toggle');

const nav =
    document.querySelector('.main-nav');


if (toggle && nav) {

    toggle.addEventListener(
        'click',
        () => {

            const open =
                nav.classList.toggle('open');


            toggle.setAttribute(
                'aria-expanded',
                open
            );

        }
    );

}


// =========================================================
// SCROLL REVEAL
// =========================================================

const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(

                entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            'visible'
                        );

                    }

                }

            );

        },

        {
            threshold: 0.08
        }

    );


document
    .querySelectorAll('.reveal')
    .forEach(

        element => {

            observer.observe(
                element
            );

        }

    );


// =========================================================
// APPLICATION COPY SYSTEM
// =========================================================

const copyBtn =
    document.getElementById(
        'copyApplication'
    );


if (copyBtn) {

    copyBtn.addEventListener(

        'click',

        async () => {

            const get =
                id =>
                    document
                        .getElementById(id)
                        ?.value
                        ?.trim()
                    ||
                    'Not provided';


            const text =
`21ST CAVALRY DIVISION - ENLISTMENT APPLICATION

Display Name / Callsign: ${get('appName')}
Age: ${get('appAge')}
Timezone: ${get('appTimezone')}
Preferred Role: ${get('appRole')}

Previous Experience:
${get('appExp')}

Why I Want to Join:
${get('appWhy')}`;


            const status =
                document.getElementById(
                    'copyStatus'
                );


            try {

                await navigator
                    .clipboard
                    .writeText(text);


                if (status) {

                    status.textContent =
                        'Application copied. Open Discord and paste it into the recruitment channel.';

                }

            }

            catch (error) {

                console.error(
                    'Application copy failed:',
                    error
                );


                if (status) {

                    status.textContent =
                        'Copy failed. Select your answers manually and paste them into Discord.';

                }

            }

        }

    );

}


// =========================================================
// SUPABASE CONFIGURATION
// =========================================================

const SUPABASE_URL =
    'https://uwtvgpeijygvjpcifkew.supabase.co';


const SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_xA3go5xRhg62NnEELn3I6Q_kCk54JuZ';


const SITE_URL =
    'https://21stcavalrydivision.github.io/';


// =========================================================
// MEMBER ELEMENTS
// =========================================================

const loginBtn =
    document.getElementById(
        'discordLoginBtn'
    );


const logoutBtn =
    document.getElementById(
        'discordLogoutBtn'
    );


const memberProfile =
    document.getElementById(
        'memberProfile'
    );


const memberAvatar =
    document.getElementById(
        'memberAvatar'
    );


const memberName =
    document.getElementById(
        'memberName'
    );


let supabaseClient = null;


// =========================================================
// MEMBER DISPLAY NAME
// =========================================================

function getDisplayName(user) {

    const metadata =
        user?.user_metadata || {};


    return (

        metadata.full_name ||

        metadata.name ||

        metadata.preferred_username ||

        metadata.user_name ||

        metadata.username ||

        user?.email ||

        '21st Cavalry Member'

    );

}


// =========================================================
// MEMBER AVATAR
// =========================================================

function getAvatarUrl(user) {

    const metadata =
        user?.user_metadata || {};


    return (

        metadata.avatar_url ||

        metadata.picture ||

        ''

    );

}


// =========================================================
// UPDATE MEMBER INTERFACE
// =========================================================

function renderAuthState(session) {

    if (
        !loginBtn ||
        !memberProfile
    ) {

        return;

    }


    const user =
        session?.user || null;


    // =====================================================
    // LOGGED OUT
    // =====================================================

    if (!user) {

        loginBtn.hidden =
            false;


        loginBtn.disabled =
            false;


        loginBtn.textContent =
            'Login with Discord';


        memberProfile.hidden =
            true;


        return;

    }


    // =====================================================
    // LOGGED IN
    // =====================================================

    loginBtn.hidden =
        true;


    memberProfile.hidden =
        false;


    // MEMBER NAME

    if (memberName) {

        memberName.textContent =
            getDisplayName(user);

    }


    // MEMBER AVATAR

    if (memberAvatar) {

        const avatar =
            getAvatarUrl(user);


        if (avatar) {

            memberAvatar.src =
                avatar;


            memberAvatar.alt =
                getDisplayName(user) +
                ' Discord avatar';


            memberAvatar.hidden =
                false;

        }

        else {

            memberAvatar.removeAttribute(
                'src'
            );


            memberAvatar.hidden =
                true;

        }

    }

}


// =========================================================
// DISCORD LOGIN
// =========================================================

async function startDiscordLogin() {

    console.log(
        'Discord login button clicked.'
    );


    if (!supabaseClient) {

        console.error(
            'Supabase client has not initialized.'
        );


        alert(
            'The login system is still loading. Refresh the page and try again.'
        );


        return;

    }


    loginBtn.disabled =
        true;


    loginBtn.textContent =
        'Connecting...';


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithOAuth({

                    provider:
                        'discord',

                    options: {

                        redirectTo:
                            SITE_URL

                    }

                });


        if (error) {

            throw error;

        }


        console.log(
            'Discord OAuth response:',
            data
        );


        /*
         * Supabase normally redirects the browser
         * automatically when skipBrowserRedirect is false.
         *
         * This fallback makes sure the browser still moves
         * to the OAuth URL if a URL is returned.
         */

        if (
            data?.url &&
            window.location.href !== data.url
        ) {

            window.location.assign(
                data.url
            );

        }

    }

    catch (error) {

        console.error(
            'Discord OAuth failed:',
            error
        );


        loginBtn.disabled =
            false;


        loginBtn.textContent =
            'Login with Discord';


        alert(
            'Discord login failed: ' +
            (
                error?.message ||
                'Unknown authentication error.'
            )
        );

    }

}


// =========================================================
// LOGOUT
// =========================================================

async function logoutMember() {

    if (!supabaseClient) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .auth
                .signOut();


        if (error) {

            throw error;

        }


        renderAuthState(
            null
        );


        window.location.replace(
            SITE_URL
        );

    }

    catch (error) {

        console.error(
            'Logout failed:',
            error
        );


        alert(
            'Logout failed: ' +
            (
                error?.message ||
                'Unknown error.'
            )
        );

    }

}


// =========================================================
// INITIALIZE SUPABASE
// =========================================================

async function initializeMemberAuth() {

    console.log(
        'Starting 21st Cavalry authentication system...'
    );


    /*
     * Other pages may use script.js without containing
     * the member-login HTML.
     */

    if (!loginBtn) {

        console.log(
            'No login button exists on this page.'
        );


        return;

    }


    // =====================================================
    // VERIFY SUPABASE LIBRARY
    // =====================================================

    if (
        typeof window.supabase ===
        'undefined'
    ) {

        console.error(
            'Supabase JavaScript library did not load.'
        );


        alert(
            'The authentication library failed to load. Refresh the page and try again.'
        );


        return;

    }


    try {

        // =================================================
        // CREATE CLIENT
        // =================================================

        supabaseClient =
            window.supabase.createClient(

                SUPABASE_URL,

                SUPABASE_PUBLISHABLE_KEY,

                {

                    auth: {

                        persistSession:
                            true,

                        autoRefreshToken:
                            true,

                        detectSessionInUrl:
                            true

                    }

                }

            );


        console.log(
            'Supabase client initialized.'
        );


        // =================================================
        // GET CURRENT SESSION
        // =================================================

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            throw error;

        }


        renderAuthState(
            data?.session || null
        );


        // =================================================
        // WATCH AUTH CHANGES
        // =================================================

        supabaseClient
            .auth
            .onAuthStateChange(

                (
                    event,
                    session
                ) => {

                    console.log(
                        'Supabase authentication event:',
                        event
                    );


                    renderAuthState(
                        session
                    );

                }

            );

    }

    catch (error) {

        console.error(
            'Supabase initialization failed:',
            error
        );


        loginBtn.disabled =
            false;


        loginBtn.textContent =
            'Login with Discord';


        alert(
            'The login system could not initialize: ' +
            (
                error?.message ||
                'Unknown error.'
            )
        );

    }

}


// =========================================================
// LOGIN BUTTON EVENT
// =========================================================

if (loginBtn) {

    loginBtn.addEventListener(

        'click',

        startDiscordLogin

    );

}


// =========================================================
// LOGOUT BUTTON EVENT
// =========================================================

if (logoutBtn) {

    logoutBtn.addEventListener(

        'click',

        logoutMember

    );

}


// =========================================================
// START AUTHENTICATION
// =========================================================

initializeMemberAuth();
