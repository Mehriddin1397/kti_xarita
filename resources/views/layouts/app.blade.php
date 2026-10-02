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
    <link rel="stylesheet" href="{{ asset('assets/css/app.css') }}">
    <style>* { touch-action: manipulation; }</style>
    <script>
        try {
            var savedScale = localStorage.getItem('preferred_font_scale');
            if (savedScale) {
                document.documentElement.style.setProperty('--font-scale', savedScale);
            }
        } catch (e) {}
    </script>
    @stack('styles')
</head>
<body>
    @yield('content')
    @stack('scripts')
</body>
</html>
