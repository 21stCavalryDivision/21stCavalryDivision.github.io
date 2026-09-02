// =========================================================
// 21ST CAVALRY DIVISION
// MAIN WEBSITE JAVASCRIPT
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
// SCROLL REVEAL ANIMATIONS
// =========================================================

const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(

                entry => {

                    if (
                        entry.isIntersecting
                    ) {

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
// ENLISTMENT APPLICATION COPY SYSTEM
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

                if (status) {

                    status.textContent =
                        'Copy failed. Select your answers manually and paste them into Discord.';

                }

            }

        }

    );

}


// =========================================================
// SUPABASE + DISCORD LOGIN
// =========================================================


// ---------------------------------------------------------
// SUPABASE PROJECT CONFIGURATION
// ---------------------------------------------------------

const SUPABASE_URL =
    'https://uwtvgpeijygvjpcifkew.supabase.co';


const SUPABASE_ANON_KEY =
    'sb_publishable_xA3go5xRhg62NnEELn3I6Q_kCk54JuZ';


// ---------------------------------------------------------
// AUTHENTICATION ELEMENTS
// ---------------------------------------------------------

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
// GET RETURN URL
// =========================================================

function getReturnUrl() {

    return (
        window.location.origin +
        window.location.pathname
    );

}


// =========================================================
// GET MEMBER DISPLAY NAME
// =========================================================

function getDisplayName(user) {

    const meta =
        user?.user_metadata || {};


    return (

        meta.full_name ||

        meta.name ||

        meta.preferred_username ||

        meta.user_name ||

        user?.email ||

        '21st Cavalry Member'

    );

}


// =========================================================
// GET DISCORD AVATAR
// =========================================================

function getAvatarUrl(user) {

    const meta =
        user?.user_metadata || {};


    return (

        meta.avatar_url ||

        meta.picture ||

        ''

    );

}


// =========================================================
// DISPLAY LOGIN STATE
// =========================================================

function renderAuthState(session) {

    const user =
        session?.user;


    if (
        !loginBtn ||
        !memberProfile
    ) {

        return;

    }


    // =====================================================
    // MEMBER LOGGED IN
    // =====================================================

    if (user) {

        loginBtn.hidden =
            true;


        memberProfile.hidden =
            false;


        // DISPLAY MEMBER NAME

        if (memberName) {

            memberName.textContent =
                getDisplayName(user);

        }


        // DISPLAY DISCORD AVATAR

        if (memberAvatar) {

            const avatar =
                getAvatarUrl(user);


            if (avatar) {

                memberAvatar.src =
                    avatar;


                memberAvatar.alt =
                    `${getDisplayName(user)} Discord avatar`;


                memberAvatar.hidden =
                    false;

            }

            else {

                memberAvatar.removeAttribute(
                    'src'
                );


                memberAvatar.alt =
                    '';


                memberAvatar.hidden =
                    true;

            }

        }

    }


    // =====================================================
    // MEMBER LOGGED OUT
    // =====================================================

    else {

        loginBtn.hidden =
            false;


        memberProfile.hidden =
            true;

    }

}


// =========================================================
// LOGIN WITH DISCORD
// =========================================================

async function startDiscordLogin() {

    if (!supabaseClient) {

        console.error(
            'Supabase client is not initialized.'
        );

        return;

    }


    const {
        data,
        error
    } =
        await supabaseClient.auth.signInWithOAuth({

            provider: 'discord',

            options: {

                redirectTo:
                    getReturnUrl()

            }

        });


    if (error) {

        console.error(
            'Discord login error:',
            error
        );


        alert(
            'Discord login could not be started. Please try again.'
        );

    }

}


// =========================================================
// LOGOUT MEMBER
// =========================================================

async function logoutMember() {

    if (!supabaseClient) {

        return;

    }


    const {
        error
    } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            'Logout error:',
            error
        );


        alert(
            'Logout failed. Please try again.'
        );

    }

}


// =========================================================
// INITIALIZE SUPABASE AUTHENTICATION
// =========================================================

async function initializeMemberAuth() {

    // Only run authentication on pages
    // containing the member login interface.

    if (
        !loginBtn &&
        !memberProfile
    ) {

        return;

    }


    // Make sure Supabase JavaScript loaded.

    if (
        typeof window.supabase ===
        'undefined'
    ) {

        console.error(
            'Supabase library did not load.'
        );

        return;

    }


    // =====================================================
    // CREATE SUPABASE CLIENT
    // =====================================================

    supabaseClient =
        window.supabase.createClient(

            SUPABASE_URL,

            SUPABASE_ANON_KEY

        );


    // =====================================================
    // CHECK CURRENT LOGIN SESSION
    // =====================================================

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {

        console.error(
            'Unable to read Supabase session:',
            error
        );

    }


    renderAuthState(
        data?.session || null
    );


    // =====================================================
    // WATCH LOGIN / LOGOUT CHANGES
    // =====================================================

    supabaseClient
        .auth
        .onAuthStateChange(

            (
                event,
                session
            ) => {

                console.log(
                    'Authentication event:',
                    event
                );


                renderAuthState(
                    session
                );

            }

        );

}


// =========================================================
// LOGIN BUTTON
// =========================================================

if (loginBtn) {

    loginBtn.addEventListener(

        'click',

        startDiscordLogin

    );

}


// =========================================================
// LOGOUT BUTTON
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
