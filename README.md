# Projeto: portfolio

## Descricao do Projeto
[Insira a descricao aqui]

## Arquitetura e Estrutura de Pastas
```text
portfolio/
    .gitignore
    backend-api/
        .env
        main.py
        package.json
        requirements.txt
    frontend-web/
        package-lock.json
        package.json
        src/
            .env.local
            eslint.config.mjs
            middleware.ts
            next-env.d.ts
            next.config.mjs
            package-lock.json
            package.json
            postcss.config.mjs
            tailwind.config.ts
            tsconfig.json
            .next/
                app-build-manifest.json
                build-manifest.json
                package.json
                react-loadable-manifest.json
                routes-manifest.json
                trace
                cache/
                    .tsbuildinfo
                    swc/
                        plugins/
                            v7_windows_x86_64_0.106.15/
                    webpack/
                        client-development/
                            0.pack.gz
                            1.pack.gz
                            10.pack.gz
                            11.pack.gz
                            12.pack.gz
                            13.pack.gz
                            14.pack.gz
                            15.pack.gz
                            16.pack.gz
                            17.pack.gz
                            18.pack.gz
                            2.pack.gz
                            3.pack.gz
                            4.pack.gz
                            5.pack.gz
                            6.pack.gz
                            7.pack.gz
                            8.pack.gz
                            9.pack.gz
                            index.pack.gz
                            index.pack.gz.old
                        client-production/
                            0.pack
                            index.pack
                        edge-server-development/
                            0.pack.gz
                            1.pack.gz
                            index.pack.gz
                            index.pack.gz.old
                        edge-server-production/
                            0.pack
                            index.pack
                        server-development/
                            0.pack.gz
                            1.pack.gz
                            10.pack.gz
                            11.pack.gz
                            12.pack.gz
                            13.pack.gz
                            14.pack.gz
                            15.pack.gz
                            16.pack.gz
                            2.pack.gz
                            3.pack.gz
                            4.pack.gz
                            5.pack.gz
                            6.pack.gz
                            7.pack.gz
                            8.pack.gz
                            9.pack.gz
                            index.pack.gz
                            index.pack.gz.old
                        server-production/
                            0.pack
                            index.pack
                server/
                    app-paths-manifest.json
                    edge-runtime-webpack.js
                    edge-runtime-webpack.js.map
                    font-manifest.json
                    interception-route-rewrite-manifest.js
                    middleware-build-manifest.js
                    middleware-manifest.json
                    middleware-react-loadable-manifest.js
                    middleware.js
                    middleware.js.map
                    next-font-manifest.js
                    next-font-manifest.json
                    pages-manifest.json
                    server-reference-manifest.js
                    server-reference-manifest.json
                    webpack-runtime.js
                    app/
                        page.js
                        page.js.nft.json
                        page_client-reference-manifest.js
                        admin/
                            dashboard/
                                page.js
                                page.js.nft.json
                                page_client-reference-manifest.js
                                certificados/
                                    page.js
                                    page.js.nft.json
                                    page_client-reference-manifest.js
                                experiencias/
                                    page.js
                                    page.js.nft.json
                                    page_client-reference-manifest.js
                                projetos/
                                    page.js
                                    page.js.nft.json
                                    page_client-reference-manifest.js
                                    editar/
                                        [id]/
                                            page.js
                                            page.js.nft.json
                                            page_client-reference-manifest.js
                                    novo/
                                        page.js
                                        page.js.nft.json
                                        page_client-reference-manifest.js
                                skills/
                                    page.js
                                    page.js.nft.json
                                    page_client-reference-manifest.js
                            login/
                                page.js
                                page.js.nft.json
                                page_client-reference-manifest.js
                        api/
                            auth/
                                verify-password/
                                    route.js
                                    route.js.nft.json
                                [...nextauth]/
                                    route.js
                                    route.js.nft.json
                            revalidate/
                                route.js
                                route.js.nft.json
                        favicon.ico/
                            route.js
                            route.js.nft.json
                        _not-found/
                            page.js
                            page.js.nft.json
                            page_client-reference-manifest.js
                    chunks/
                        125.js
                        202.js
                        331.js
                        434.js
                        505.js
                        682.js
                        737.js
                        750.js
                        819.js
                        915.js
                        948.js
                        972.js
                        font-manifest.json
                    pages/
                        _app.js
                        _app.js.nft.json
                        _document.js
                        _document.js.nft.json
                        _error.js
                        _error.js.nft.json
                static/
                    chunks/
                        0f8af13e.b15eded67ff3d8db.js
                        117-2bf28ed8d475dab8.js
                        254.72dc0df5c5b7bf3d.js
                        274.1daa13fa35cfe344.js
                        410.0db584ebfa66c9cf.js
                        41ade5dc-c937924ef58bd216.js
                        426-c246ba7a2b931371.js
                        433-a89587ad8b30db70.js
                        44530001-8f53bce17fa5a9e5.js
                        497.ac3f61ff19a385db.js
                        603-488459f45cb3d043.js
                        640.e575d8e44b40aa56.js
                        653-5a61a3db513f791b.js
                        659-9f650559d99b5940.js
                        736.b32b387a12e71154.js
                        807.f84de691875c2131.js
                        b536a0f1.85689b935c1a9952.js
                        fd9d1056-aee146a4bd903703.js
                        framework-d1703057b07599d4.js
                        main-app-0e16da7e1ae5cfef.js
                        main-eec3793b5f6153d0.js
                        polyfills-42372ed130431b0a.js
                        webpack-ad8087ce08d63a25.js
                        app/
                            layout-10db0a029dbddfc9.js
                            page-570f71979eb20dfb.js
                            admin/
                                dashboard/
                                    page-513e46b4a8ae2594.js
                                    certificados/
                                        page-65394a8c8128793e.js
                                    experiencias/
                                        page-e30479b392653bc4.js
                                    projetos/
                                        page-4f0bf16b5ddff190.js
                                        editar/
                                            [id]/
                                                page-2fa1e18c261c302b.js
                                        novo/
                                            page-8facc41607ab6c33.js
                                    skills/
                                        page-c043f1084b04b8a9.js
                                login/
                                    page-00f5fc07d83367cd.js
                            _not-found/
                                page-82b667410187fd9e.js
                        pages/
                            _app-72b849fbd24ac258.js
                            _error-7ba65e1336b92748.js
                    css/
                        a4425e1616d9956a.css
                    media/
                        0aa834ed78bf6d07-s.woff2
                        19cfc7226ec3afaa-s.woff2
                        21350d82a1f187e9-s.woff2
                        67957d42bae0796d-s.woff2
                        886030b0b59bc5a7-s.woff2
                        8e9860b6e62d6359-s.woff2
                        939c4f875ee75fbb-s.woff2
                        ba9851c3c22cd980-s.woff2
                        bb3ef058b751a6ad-s.p.woff2
                        c5fe6dc8356a8c31-s.woff2
                        df0a9ae256c0569c-s.woff2
                        e4af272ccee01ff0-s.p.woff2
                        f911b923c6adde36-s.woff2
                    nUp2zm-6zJH71E_U4h-R5/
                        _buildManifest.js
                        _ssgManifest.js
                types/
                    package.json
                    app/
                        layout.ts
                        page.ts
                        admin/
                            dashboard/
                                page.ts
                                certificados/
                                    page.ts
                                experiencias/
                                    page.ts
                                projetos/
                                    page.ts
                                    editar/
                                        [id]/
                                            page.ts
                                    novo/
                                        page.ts
                                skills/
                                    page.ts
                            login/
                                page.ts
                        api/
                            auth/
                                verify-password/
                                    route.ts
                                [...nextauth]/
                                    route.ts
                            revalidate/
                                route.ts
            app/
                favicon.ico
                globals.css
                layout.tsx
                page.tsx
                admin/
                    dashboard/
                        page.tsx
                        certificados/
                            page.tsx
                        experiencias/
                            page.tsx
                        projetos/
                            page.tsx
                            editar/
                                [id]/
                                    page.tsx
                            novo/
                                page.tsx
                        skills/
                            page.tsx
                    login/
                        page.tsx
                api/
                    auth/
                        verify-password/
                            route.ts
                        [...nextauth]/
                            route.ts
                    revalidate/
                        route.ts
            components/
                ApiStatus.tsx
                BackgroundWrapper.tsx
                ClientEffects.tsx
                CompetenceSection.tsx
                ContactForm.tsx
                CustomCursor.tsx
                EffectsWrapper.tsx
                ExperienceItem.tsx
                Footer.tsx
                Hero.tsx
                HomeClient.tsx
                Navbar.tsx
                ParticleBackground.tsx
                ProjectCard3D.tsx
                ProjectCarousel.tsx
                ScrollProgress.tsx
                Skeletons.tsx
                SpotlightCard.tsx
                SystemBoot.tsx
                TechWordle.tsx
                NeuralNexus/
                    CertificatesHUD.tsx
                    Scene.tsx
            contexts/
                LanguageContext.tsx
                ThemeContext.tsx
            hooks/
                useCachedData.ts
                useKonamiCode.ts
                usePortfolioData.ts
                useSoundEffects.ts
            lib/
                supabase.ts
            public/
                curriculo.pdf
                curriculo_en.pdf
                file.svg
                globe.svg
                next.svg
                opengraph-image.png
                vercel.svg
                window.svg
```

## Relatorio Detalhado de Arquivos
| Arquivo | Tamanho | Linhas | Ultima Modificacao |
| :--- | :--- | :--- | :--- |
| .gitignore | 149.00B | 12 | 2026-05-02 10:04:57 |
| backend-api\.env | 441.00B | 6 | 2026-05-01 11:39:11 |
| backend-api\main.py | 14.90KB | 329 | 2026-04-27 21:27:29 |
| backend-api\package.json | 852.00B | 34 | 2026-04-27 21:27:29 |
| backend-api\requirements.txt | 119.00B | 10 | 2026-04-27 21:27:29 |
| frontend-web\package-lock.json | 276.68KB | 7797 | 2026-05-02 11:00:20 |
| frontend-web\package.json | 999.00B | 40 | 2026-05-02 10:55:58 |
| frontend-web\src\.env.local | 852.00B | 10 | 2026-05-02 09:59:09 |
| frontend-web\src\eslint.config.mjs | 483.00B | 18 | 2026-04-27 21:27:29 |
| frontend-web\src\middleware.ts | 307.00B | 15 | 2026-05-01 11:50:12 |
| frontend-web\src\next-env.d.ts | 233.00B | 5 | 2026-05-01 11:47:00 |
| frontend-web\src\next.config.mjs | 286.00B | 13 | 2026-04-27 21:27:29 |
| frontend-web\src\package-lock.json | 282.16KB | 7742 | 2026-05-01 12:37:36 |
| frontend-web\src\package.json | 1.08KB | 42 | 2026-05-01 12:37:36 |
| frontend-web\src\postcss.config.mjs | 164.00B | 9 | 2026-04-27 21:27:29 |
| frontend-web\src\tailwind.config.ts | 593.00B | 21 | 2026-04-27 21:27:29 |
| frontend-web\src\tsconfig.json | 714.00B | 42 | 2026-05-01 11:47:00 |
| frontend-web\src\.next\app-build-manifest.json | 4.96KB | 114 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\build-manifest.json | 968.00B | 32 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\package.json | 20.00B | 1 | 2026-05-02 09:56:04 |
| frontend-web\src\.next\react-loadable-manifest.json | 1.24KB | 46 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\routes-manifest.json | 2.14KB | 1 | 2026-05-02 09:56:04 |
| frontend-web\src\.next\trace | 2.29MB | 117 | 2026-05-02 09:56:23 |
| frontend-web\src\.next\cache\.tsbuildinfo | 486.37KB | 1 | 2026-05-02 09:56:25 |
| frontend-web\src\.next\cache\webpack\client-development\0.pack.gz | 56.31KB | 230 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\client-development\1.pack.gz | 2.32KB | 10 | 2026-05-02 09:40:03 |
| frontend-web\src\.next\cache\webpack\client-development\10.pack.gz | 5.26MB | 17711 | 2026-05-02 09:52:12 |
| frontend-web\src\.next\cache\webpack\client-development\11.pack.gz | 19.63MB | 74504 | 2026-05-02 09:52:13 |
| frontend-web\src\.next\cache\webpack\client-development\12.pack.gz | 1.16KB | 6 | 2026-05-02 09:35:17 |
| frontend-web\src\.next\cache\webpack\client-development\13.pack.gz | 2.05KB | 12 | 2026-05-02 09:35:17 |
| frontend-web\src\.next\cache\webpack\client-development\14.pack.gz | 22.15KB | 90 | 2026-05-02 09:52:12 |
| frontend-web\src\.next\cache\webpack\client-development\15.pack.gz | 4.83KB | 16 | 2026-05-02 09:37:12 |
| frontend-web\src\.next\cache\webpack\client-development\16.pack.gz | 7.13MB | 22113 | 2026-05-02 09:40:04 |
| frontend-web\src\.next\cache\webpack\client-development\17.pack.gz | 19.63MB | 74438 | 2026-05-02 09:37:12 |
| frontend-web\src\.next\cache\webpack\client-development\18.pack.gz | 607.79KB | 2041 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\client-development\2.pack.gz | 3.43MB | 11089 | 2026-05-02 09:40:04 |
| frontend-web\src\.next\cache\webpack\client-development\3.pack.gz | 82.58KB | 351 | 2026-05-02 09:52:12 |
| frontend-web\src\.next\cache\webpack\client-development\4.pack.gz | 7.09KB | 32 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\client-development\5.pack.gz | 3.37MB | 11055 | 2026-05-02 09:17:56 |
| frontend-web\src\.next\cache\webpack\client-development\6.pack.gz | 2.58KB | 11 | 2026-05-02 09:52:12 |
| frontend-web\src\.next\cache\webpack\client-development\7.pack.gz | 1.82MB | 6546 | 2026-05-02 09:40:04 |
| frontend-web\src\.next\cache\webpack\client-development\8.pack.gz | 3.42MB | 10917 | 2026-05-02 09:40:04 |
| frontend-web\src\.next\cache\webpack\client-development\9.pack.gz | 6.78MB | 21866 | 2026-05-02 09:22:04 |
| frontend-web\src\.next\cache\webpack\client-development\index.pack.gz | 582.68KB | 3713 | 2026-05-02 09:52:12 |
| frontend-web\src\.next\cache\webpack\client-development\index.pack.gz.old | 582.57KB | 3744 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\client-production\0.pack | 87.11MB | 1824224 | 2026-05-02 09:56:23 |
| frontend-web\src\.next\cache\webpack\client-production\index.pack | 14.13MB | 3680 | 2026-05-02 09:56:23 |
| frontend-web\src\.next\cache\webpack\edge-server-development\0.pack.gz | 1.31MB | 4905 | 2026-05-02 08:44:46 |
| frontend-web\src\.next\cache\webpack\edge-server-development\1.pack.gz | 190.58KB | 765 | 2026-05-01 12:18:59 |
| frontend-web\src\.next\cache\webpack\edge-server-development\index.pack.gz | 68.88KB | 256 | 2026-05-02 08:44:46 |
| frontend-web\src\.next\cache\webpack\edge-server-development\index.pack.gz.old | 68.75KB | 279 | 2026-05-01 12:37:59 |
| frontend-web\src\.next\cache\webpack\edge-server-production\0.pack | 7.97MB | 105649 | 2026-05-02 09:56:14 |
| frontend-web\src\.next\cache\webpack\edge-server-production\index.pack | 388.88KB | 1146 | 2026-05-02 09:56:14 |
| frontend-web\src\.next\cache\webpack\server-development\0.pack.gz | 2.52KB | 16 | 2026-05-02 09:41:00 |
| frontend-web\src\.next\cache\webpack\server-development\1.pack.gz | 94.24KB | 376 | 2026-05-02 09:53:14 |
| frontend-web\src\.next\cache\webpack\server-development\10.pack.gz | 126.25KB | 483 | 2026-05-02 09:53:14 |
| frontend-web\src\.next\cache\webpack\server-development\11.pack.gz | 1.12MB | 3977 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\server-development\12.pack.gz | 5.19MB | 19049 | 2026-05-02 09:33:06 |
| frontend-web\src\.next\cache\webpack\server-development\13.pack.gz | 14.38KB | 62 | 2026-05-02 09:53:14 |
| frontend-web\src\.next\cache\webpack\server-development\14.pack.gz | 4.28MB | 16567 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\server-development\15.pack.gz | 3.74MB | 13553 | 2026-05-02 09:53:15 |
| frontend-web\src\.next\cache\webpack\server-development\16.pack.gz | 335.97KB | 1233 | 2026-05-02 09:53:14 |
| frontend-web\src\.next\cache\webpack\server-development\2.pack.gz | 154.03KB | 592 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\server-development\3.pack.gz | 5.19KB | 29 | 2026-05-02 09:37:12 |
| frontend-web\src\.next\cache\webpack\server-development\4.pack.gz | 10.57KB | 27 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\server-development\5.pack.gz | 2.44MB | 8703 | 2026-05-02 09:41:00 |
| frontend-web\src\.next\cache\webpack\server-development\6.pack.gz | 8.53KB | 34 | 2026-05-02 09:41:00 |
| frontend-web\src\.next\cache\webpack\server-development\7.pack.gz | 92.81KB | 353 | 2026-05-02 09:41:00 |
| frontend-web\src\.next\cache\webpack\server-development\8.pack.gz | 512.86KB | 1673 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\server-development\9.pack.gz | 50.46KB | 192 | 2026-05-02 09:41:00 |
| frontend-web\src\.next\cache\webpack\server-development\index.pack.gz | 639.93KB | 2165 | 2026-05-02 09:53:14 |
| frontend-web\src\.next\cache\webpack\server-development\index.pack.gz.old | 639.71KB | 2165 | 2026-05-02 09:50:38 |
| frontend-web\src\.next\cache\webpack\server-production\0.pack | 72.70MB | 1336849 | 2026-05-02 09:56:12 |
| frontend-web\src\.next\cache\webpack\server-production\index.pack | 15.89MB | 2698 | 2026-05-02 09:56:12 |
| frontend-web\src\.next\server\app-paths-manifest.json | 948.00B | 16 | 2026-05-02 09:56:13 |
| frontend-web\src\.next\server\edge-runtime-webpack.js | 1.46KB | 2 | 2026-05-02 09:56:14 |
| frontend-web\src\.next\server\edge-runtime-webpack.js.map | 8.45KB | 1 | 2026-05-02 09:56:14 |
| frontend-web\src\.next\server\font-manifest.json | 2.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\interception-route-rewrite-manifest.js | 48.00B | 1 | 2026-05-02 09:56:14 |
| frontend-web\src\.next\server\middleware-build-manifest.js | 888.00B | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\middleware-manifest.json | 1.13KB | 36 | 2026-05-02 09:56:14 |
| frontend-web\src\.next\server\middleware-react-loadable-manifest.js | 1.06KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\middleware.js | 157.88KB | 17 | 2026-05-02 09:56:14 |
| frontend-web\src\.next\server\middleware.js.map | 541.84KB | 1 | 2026-05-02 09:56:14 |
| frontend-web\src\.next\server\next-font-manifest.js | 106.00B | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\next-font-manifest.json | 77.00B | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\pages-manifest.json | 100.00B | 5 | 2026-05-02 09:56:13 |
| frontend-web\src\.next\server\server-reference-manifest.js | 123.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\server-reference-manifest.json | 84.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\webpack-runtime.js | 1.45KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\page.js | 82.08KB | 70 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\page.js.nft.json | 259.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\page_client-reference-manifest.js | 7.22KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\app\admin\dashboard\page.js | 22.28KB | 9 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\page.js.nft.json | 269.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\page_client-reference-manifest.js | 7.46KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\app\admin\dashboard\certificados\page.js | 17.51KB | 7 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\certificados\page.js.nft.json | 349.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\certificados\page_client-reference-manifest.js | 7.82KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\app\admin\dashboard\experiencias\page.js | 18.10KB | 7 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\experiencias\page.js.nft.json | 349.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\experiencias\page_client-reference-manifest.js | 7.82KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\app\admin\dashboard\projetos\page.js | 12.83KB | 18 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\projetos\page.js.nft.json | 349.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\projetos\page_client-reference-manifest.js | 7.80KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\app\admin\dashboard\projetos\editar\[id]\page.js | 9.45KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\projetos\editar\[id]\page.js.nft.json | 409.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\projetos\editar\[id]\page_client-reference-manifest.js | 8.18KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\app\admin\dashboard\projetos\novo\page.js | 9.46KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\projetos\novo\page.js.nft.json | 348.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\projetos\novo\page_client-reference-manifest.js | 8.11KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\app\admin\dashboard\skills\page.js | 16.74KB | 18 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\skills\page.js.nft.json | 349.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\dashboard\skills\page_client-reference-manifest.js | 7.80KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\app\admin\login\page.js | 16.36KB | 9 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\login\page.js.nft.json | 269.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\admin\login\page_client-reference-manifest.js | 7.45KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\app\api\auth\verify-password\route.js | 1.57KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\api\auth\verify-password\route.js.nft.json | 145.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\api\auth\[...nextauth]\route.js | 288.38KB | 34 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\api\auth\[...nextauth]\route.js.nft.json | 117.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\api\revalidate\route.js | 12.69KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\api\revalidate\route.js.nft.json | 133.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\favicon.ico\route.js | 71.13KB | 12 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\favicon.ico\route.js.nft.json | 99.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\_not-found\page.js | 13.19KB | 9 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\_not-found\page.js.nft.json | 152.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\app\_not-found\page_client-reference-manifest.js | 7.29KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\server\chunks\125.js | 199.31KB | 37 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\202.js | 31.30KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\331.js | 222.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\434.js | 24.84KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\505.js | 98.38KB | 2 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\682.js | 32.90KB | 6 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\737.js | 77.45KB | 60 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\750.js | 11.05KB | 9 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\819.js | 112.74KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\915.js | 30.11KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\948.js | 56.33KB | 2 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\972.js | 38.11KB | 12 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\chunks\font-manifest.json | 2.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\pages\_app.js | 3.23KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\pages\_app.js.nft.json | 119.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\pages\_document.js | 384.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\pages\_document.js.nft.json | 143.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\pages\_error.js | 8.46KB | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\server\pages\_error.js.nft.json | 66.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\static\chunks\0f8af13e.b15eded67ff3d8db.js | 79.41KB | 158 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\117-2bf28ed8d475dab8.js | 121.45KB | 2 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\254.72dc0df5c5b7bf3d.js | 1.07KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\274.1daa13fa35cfe344.js | 8.21KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\410.0db584ebfa66c9cf.js | 141.32KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\41ade5dc-c937924ef58bd216.js | 77.22KB | 60 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\426-c246ba7a2b931371.js | 27.14KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\433-a89587ad8b30db70.js | 31.45KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\44530001-8f53bce17fa5a9e5.js | 58.83KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\497.ac3f61ff19a385db.js | 178.19KB | 49 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\603-488459f45cb3d043.js | 28.83KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\640.e575d8e44b40aa56.js | 3.19KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\653-5a61a3db513f791b.js | 114.25KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\659-9f650559d99b5940.js | 171.10KB | 37 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\736.b32b387a12e71154.js | 1.95KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\807.f84de691875c2131.js | 2.63KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\b536a0f1.85689b935c1a9952.js | 652.46KB | 227 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\fd9d1056-aee146a4bd903703.js | 168.78KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\framework-d1703057b07599d4.js | 136.70KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\main-app-0e16da7e1ae5cfef.js | 461.00B | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\main-eec3793b5f6153d0.js | 114.34KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\polyfills-42372ed130431b0a.js | 109.96KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\webpack-ad8087ce08d63a25.js | 3.97KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\layout-10db0a029dbddfc9.js | 11.69KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\page-570f71979eb20dfb.js | 69.55KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\admin\dashboard\page-513e46b4a8ae2594.js | 9.75KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\admin\dashboard\certificados\page-65394a8c8128793e.js | 16.73KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\admin\dashboard\experiencias\page-e30479b392653bc4.js | 17.30KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\admin\dashboard\projetos\page-4f0bf16b5ddff190.js | 12.05KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\admin\dashboard\projetos\editar\[id]\page-2fa1e18c261c302b.js | 8.56KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\admin\dashboard\projetos\novo\page-8facc41607ab6c33.js | 7.88KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\admin\dashboard\skills\page-c043f1084b04b8a9.js | 15.99KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\admin\login\page-00f5fc07d83367cd.js | 7.17KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\app\_not-found\page-82b667410187fd9e.js | 1.70KB | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\pages\_app-72b849fbd24ac258.js | 280.00B | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\chunks\pages\_error-7ba65e1336b92748.js | 247.00B | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\css\a4425e1616d9956a.css | 66.36KB | 3 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\0aa834ed78bf6d07-s.woff2 | 11.78KB | 52 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\19cfc7226ec3afaa-s.woff2 | 18.60KB | 69 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\21350d82a1f187e9-s.woff2 | 18.30KB | 90 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\67957d42bae0796d-s.woff2 | 8.87KB | 34 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\886030b0b59bc5a7-s.woff2 | 1.97KB | 9 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\8e9860b6e62d6359-s.woff2 | 83.27KB | 350 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\939c4f875ee75fbb-s.woff2 | 14.85KB | 62 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\ba9851c3c22cd980-s.woff2 | 25.24KB | 98 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\bb3ef058b751a6ad-s.p.woff2 | 39.53KB | 148 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\c5fe6dc8356a8c31-s.woff2 | 11.01KB | 42 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\df0a9ae256c0569c-s.woff2 | 10.04KB | 45 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\e4af272ccee01ff0-s.p.woff2 | 47.30KB | 192 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\media\f911b923c6adde36-s.woff2 | 7.29KB | 36 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\nUp2zm-6zJH71E_U4h-R5\_buildManifest.js | 224.00B | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\static\nUp2zm-6zJH71E_U4h-R5\_ssgManifest.js | 77.00B | 1 | 2026-05-02 09:56:21 |
| frontend-web\src\.next\types\package.json | 18.00B | 1 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\layout.ts | 3.39KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\page.ts | 3.38KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\admin\dashboard\page.ts | 3.44KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\admin\dashboard\certificados\page.ts | 3.48KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\admin\dashboard\experiencias\page.ts | 3.48KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\admin\dashboard\projetos\page.ts | 3.47KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\admin\dashboard\projetos\editar\[id]\page.ts | 3.52KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\admin\dashboard\projetos\novo\page.ts | 3.49KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\admin\dashboard\skills\page.ts | 3.46KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\admin\login\page.ts | 3.43KB | 79 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\api\auth\verify-password\route.ts | 8.31KB | 343 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\api\auth\[...nextauth]\route.ts | 8.30KB | 343 | 2026-05-02 09:56:11 |
| frontend-web\src\.next\types\app\api\revalidate\route.ts | 8.27KB | 343 | 2026-05-02 09:56:11 |
| frontend-web\src\app\favicon.ico | 19.87KB | 60 | 2026-04-27 21:27:29 |
| frontend-web\src\app\globals.css | 1.44KB | 63 | 2026-04-27 21:27:29 |
| frontend-web\src\app\layout.tsx | 2.32KB | 80 | 2026-05-02 10:59:21 |
| frontend-web\src\app\page.tsx | 7.98KB | 191 | 2026-04-27 21:27:29 |
| frontend-web\src\app\admin\dashboard\page.tsx | 9.83KB | 120 | 2026-05-02 09:39:02 |
| frontend-web\src\app\admin\dashboard\certificados\page.tsx | 23.72KB | 387 | 2026-05-02 09:20:52 |
| frontend-web\src\app\admin\dashboard\experiencias\page.tsx | 24.72KB | 396 | 2026-05-02 09:16:38 |
| frontend-web\src\app\admin\dashboard\projetos\page.tsx | 16.79KB | 320 | 2026-05-02 08:55:53 |
| frontend-web\src\app\admin\dashboard\projetos\editar\[id]\page.tsx | 12.10KB | 249 | 2026-05-01 12:56:28 |
| frontend-web\src\app\admin\dashboard\projetos\novo\page.tsx | 10.49KB | 210 | 2026-05-01 12:33:19 |
| frontend-web\src\app\admin\dashboard\skills\page.tsx | 23.20KB | 400 | 2026-05-02 08:53:14 |
| frontend-web\src\app\admin\login\page.tsx | 5.35KB | 112 | 2026-05-01 12:02:13 |
| frontend-web\src\app\api\auth\verify-password\route.ts | 959.00B | 31 | 2026-05-01 12:36:25 |
| frontend-web\src\app\api\auth\[...nextauth]\route.ts | 1.75KB | 50 | 2026-05-01 12:03:01 |
| frontend-web\src\app\api\revalidate\route.ts | 752.00B | 20 | 2026-04-27 21:27:29 |
| frontend-web\src\components\ApiStatus.tsx | 2.09KB | 68 | 2026-04-27 21:27:29 |
| frontend-web\src\components\BackgroundWrapper.tsx | 2.33KB | 45 | 2026-04-27 21:27:29 |
| frontend-web\src\components\ClientEffects.tsx | 1.55KB | 39 | 2026-05-02 10:59:28 |
| frontend-web\src\components\CompetenceSection.tsx | 3.48KB | 86 | 2026-04-27 21:27:29 |
| frontend-web\src\components\ContactForm.tsx | 10.92KB | 244 | 2026-04-27 21:27:29 |
| frontend-web\src\components\CustomCursor.tsx | 4.66KB | 139 | 2026-04-27 21:27:29 |
| frontend-web\src\components\EffectsWrapper.tsx | 1.08KB | 37 | 2026-04-27 21:27:29 |
| frontend-web\src\components\ExperienceItem.tsx | 5.50KB | 133 | 2026-05-02 09:33:16 |
| frontend-web\src\components\Footer.tsx | 1.72KB | 50 | 2026-04-27 21:27:29 |
| frontend-web\src\components\Hero.tsx | 13.00KB | 260 | 2026-04-27 21:27:29 |
| frontend-web\src\components\HomeClient.tsx | 2.99KB | 94 | 2026-04-27 21:27:29 |
| frontend-web\src\components\Navbar.tsx | 7.38KB | 190 | 2026-04-27 21:27:29 |
| frontend-web\src\components\ParticleBackground.tsx | 2.34KB | 83 | 2026-04-27 21:27:29 |
| frontend-web\src\components\ProjectCard3D.tsx | 4.83KB | 128 | 2026-04-27 21:27:29 |
| frontend-web\src\components\ProjectCarousel.tsx | 17.74KB | 359 | 2026-05-02 09:49:24 |
| frontend-web\src\components\ScrollProgress.tsx | 1.88KB | 73 | 2026-04-27 21:27:29 |
| frontend-web\src\components\Skeletons.tsx | 1.69KB | 46 | 2026-04-27 21:27:29 |
| frontend-web\src\components\SpotlightCard.tsx | 2.17KB | 69 | 2026-04-27 21:27:29 |
| frontend-web\src\components\SystemBoot.tsx | 6.10KB | 159 | 2026-04-27 21:27:29 |
| frontend-web\src\components\TechWordle.tsx | 12.85KB | 258 | 2026-04-27 21:27:29 |
| frontend-web\src\components\NeuralNexus\CertificatesHUD.tsx | 8.55KB | 198 | 2026-05-02 09:51:10 |
| frontend-web\src\components\NeuralNexus\Scene.tsx | 4.54KB | 147 | 2026-05-02 09:36:10 |
| frontend-web\src\contexts\LanguageContext.tsx | 5.95KB | 168 | 2026-04-27 21:27:29 |
| frontend-web\src\contexts\ThemeContext.tsx | 1.46KB | 50 | 2026-04-27 21:27:29 |
| frontend-web\src\hooks\useCachedData.ts | 1.70KB | 54 | 2026-04-27 21:27:29 |
| frontend-web\src\hooks\useKonamiCode.ts | 1.07KB | 32 | 2026-04-27 21:27:29 |
| frontend-web\src\hooks\usePortfolioData.ts | 2.16KB | 63 | 2026-05-02 09:16:14 |
| frontend-web\src\hooks\useSoundEffects.ts | 2.44KB | 74 | 2026-04-27 21:27:29 |
| frontend-web\src\lib\supabase.ts | 1014.00B | 25 | 2026-05-02 09:55:21 |
| frontend-web\src\public\curriculo.pdf | 426.81KB | 1791 | 2026-04-27 21:27:29 |
| frontend-web\src\public\curriculo_en.pdf | 424.07KB | 1776 | 2026-04-27 21:27:29 |
| frontend-web\src\public\file.svg | 391.00B | 1 | 2026-04-27 21:27:29 |
| frontend-web\src\public\globe.svg | 1.01KB | 1 | 2026-04-27 21:27:29 |
| frontend-web\src\public\next.svg | 1.34KB | 1 | 2026-04-27 21:27:29 |
| frontend-web\src\public\opengraph-image.png | 264.59KB | 953 | 2026-04-27 21:27:29 |
| frontend-web\src\public\vercel.svg | 128.00B | 1 | 2026-04-27 21:27:29 |
| frontend-web\src\public\window.svg | 385.00B | 1 | 2026-04-27 21:27:29 |

## Informacoes de Geracao
* Diretorio mapeado: C:/portfolio
* Data da geracao: 02/05/2026 11:06:56

---
Gerado automaticamente por generate_detalhado_readme.py
