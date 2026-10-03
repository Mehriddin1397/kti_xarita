<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Kriminologiya tadqiqot instituti — Jinoyatchilik statistikasi')</title>
    <link rel="icon" type="image/jpeg" href="/logo/photo_2025-09-03_15-19-21.jpg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/app.css') }}?v={{ file_exists(public_path('assets/css/app.css')) ? filemtime(public_path('assets/css/app.css')) : '1.0' }}">
    <style>* { touch-action: manipulation; }</style>
    <script>
        try {
            var savedScale = localStorage.getItem('preferred_font_scale');
            if (savedScale) {
                document.documentElement.style.setProperty('--font-scale', savedScale);
            }
            var savedTheme = localStorage.getItem('kti_theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
        } catch (e) {}
    </script>
    @stack('styles')
</head>
<body>
    @yield('content')
    <script>
        (function() {
            function updateThemeUI(theme) {
                var btn = document.getElementById('theme-toggle-btn');
                if (!btn) return;
                var iconSun = btn.querySelector('.icon-sun');
                var iconMoon = btn.querySelector('.icon-moon');
                var label = document.getElementById('theme-label');
                if (theme === 'light') {
                    if (iconSun) iconSun.style.display = 'block';
                    if (iconMoon) iconMoon.style.display = 'none';
                    if (label) label.textContent = 'Kunduzgi';
                    btn.setAttribute('title', 'Kechki rejimga o\'tish');
                } else {
                    if (iconSun) iconSun.style.display = 'none';
                    if (iconMoon) iconMoon.style.display = 'block';
                    if (label) label.textContent = 'Kechki';
                    btn.setAttribute('title', 'Kunduzgi rejimga o\'tish');
                }
            }

            var initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            updateThemeUI(initialTheme);

            document.addEventListener('DOMContentLoaded', function() {
                var curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                updateThemeUI(curTheme);

                var btn = document.getElementById('theme-toggle-btn');
                if (btn) {
                    btn.addEventListener('click', function() {
                        var oldTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                        var newTheme = (oldTheme === 'light') ? 'dark' : 'light';
                        document.documentElement.setAttribute('data-theme', newTheme);
                        try {
                            localStorage.setItem('kti_theme', newTheme);
                        } catch(e) {}
                        updateThemeUI(newTheme);
                        window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: newTheme } }));
                    });
                }
            });
        })();
    </script>
    @stack('scripts')
</body>
</html>
