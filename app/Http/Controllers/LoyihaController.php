<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\JsonResponse;

class LoyihaController extends Controller
{
    /**
     * Get all research projects data structured for all 14 regions
     * Based on official public/loyiha.docx document
     */
    public static function getLoyihalarData(): array
    {
        $data = [
            'overall' => [
                'total_projects' => 14,
                'completed_count' => 7,
                'in_progress_count' => 7,
                'completed_pct' => 50,
                'year' => 2026,
                'institution' => 'O\'zbekiston Respublikasi Kriminologiya tadqiqot instituti',
                'completed_list' => [
                    'Namangan viloyati',
                    'Andijon viloyati',
                    'Navoiy viloyati',
                    'Jizzax viloyati',
                    'Buxoro viloyati',
                    'Qoraqalpog\'iston Respublikasi',
                    'Toshkent viloyati',
                ],
                'in_progress_list' => [
                    'Farg\'ona viloyati',
                    'Toshkent shahri',
                    'Sirdaryo viloyati',
                    'Samarqand viloyati',
                    'Surxondaryo viloyati',
                    'Xorazm viloyati',
                    'Qashqadaryo viloyati',
                ]
            ],
            'regions' => [
                // 1. Namangan viloyati (Bajarilgan)
                'namangan' => [
                    'slug' => 'namangan',
                    'name' => 'Namangan viloyati',
                    'capital' => 'Namangan shahri',
                    'population' => 3066100,
                    'status' => 'completed',
                    'status_label' => 'Bajarilgan loyiha',
                    'badge_icon' => '✓',
                    'color' => '#10B981',
                    'project_title' => 'Namangan viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Kriminologiya tadqiqot instituti tadqiqot guruhi',
                    'period' => '2024–2025 yillar (Yakunlangan)',
                    'goal' => 'Namangan viloyatida jinoyatchilikning holati, tendensiyalari va sabablarini kompleks kriminologik tahlil qilish hamda uning oldini olishga qaratilgan samarali ilmiy-amaliy taklif va mexanizmlarni ishlab chiqish.',
                    'results' => [
                        'Oila-turmush doirasidagi zo\'ravonliklar va tan jarohati yetkazish holatlarining barvaqt oldini olish metodikasi ishlab chiqildi;',
                        'Axborot texnologiyalari (kiberjinoyat) orqali sodir etilayotgan firibgarliklarga chek qo\'yish uslubiyoti joriy etildi;',
                        'Bozorlar va gavjum jamoat joylarida "Xavfsiz hudud" intellektual tizimini tashkil etish bo\'yicha tavsiyalar tatbiq qilindi.'
                    ],
                    'outcomes' => '14 ta tuman va shahar bo\'yicha kriminologik pasportlar shakllantirilib, amaliyotga joriy etildi.'
                ],

                // 2. Andijon viloyati (Bajarilgan)
                'andijan' => [
                    'slug' => 'andijan',
                    'name' => 'Andijon viloyati',
                    'capital' => 'Andijon shahri',
                    'population' => 3394400,
                    'status' => 'completed',
                    'status_label' => 'Bajarilgan loyiha',
                    'badge_icon' => '✓',
                    'color' => '#10B981',
                    'project_title' => 'Andijon viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Kriminologiya tadqiqot instituti tadqiqot guruhi',
                    'period' => '2024–2025 yillar (Yakunlangan)',
                    'goal' => 'Andijon viloyati hududida jinoyatchilikning holati, dinamikasi va tuzilmaviy xususiyatlarini kriminologiyaning eng ilg\'or yutuqlariga tayangan holda kompleks tahlil qilish, uni keltirib chiqarayotgan sabab va shart-sharoitlarni ilmiy asosda aniqlash hamda ularni bartaraf etishga qaratilgan samarali profilaktik mexanizmlarni ishlab chiqish.',
                    'results' => [
                        'Aholisi yuqori zichlikda joylashgan tumanlarda huquqbuzarliklar profilaktikasining manzilli modeli yaratildi;',
                        'Yoshlar va voyaga yetmaganlar o\'rtasida huquqbuzarliklarning barvaqt profilaktikasi ishlab chiqildi;',
                        'Tumanlar kesimida qizil toifadagi mahallalarda kriminogen xatarlarni kamaytirish bo\'yicha amaliy chora-tadbirlar joriy etildi.'
                    ],
                    'outcomes' => '16 ta tuman va shahar bo\'yicha kompleks kriminologik tahlillar yakunlanib, hududiy profilaktika dasturiga kiritildi.'
                ],

                // 3. Navoiy viloyati (Bajarilgan)
                'navoi' => [
                    'slug' => 'navoi',
                    'name' => 'Navoiy viloyati',
                    'capital' => 'Navoiy shahri',
                    'population' => 1075300,
                    'status' => 'completed',
                    'status_label' => 'Bajarilgan loyiha',
                    'badge_icon' => '✓',
                    'color' => '#10B981',
                    'project_title' => 'Навоий вилояти жиноятчилигини тадқиқ қилиш',
                    'team' => '6 нафар (3 нафар криминолог, 1 нафар социолог, 1 нафар таҳлилчи, 1 нафар амалиёт эксперти)',
                    'period' => '2024–2025 yillar (Yakunlangan)',
                    'goal' => 'Навоий вилоятида жиноятчиликнинг ҳолати, тенденциялари ва сабабларини комплекс криминологик таҳлил қилиш ҳамда унинг олдини олишга қаратилган самарали илмий-амалий таклиф ва механизмларни ишлаб чиқиш.',
                    'annotation' => [
                        'team_count' => '6 нафар (3 криминолог, 1 социолог, 1 таҳлилчи, 1 амалиёт эксперти)',
                        'respondents' => '11 321 нафар (7 142 аёллар, 4 179 эркаклар)',
                        'proposals' => '15 га яқин илмий асосланган таклиф ва тавсия',
                        'presentation' => '25 июнь — Навоий вилояти ИИБ ва Миллий гвардия бошқармасида тақдимот',
                        'certificates' => '“Ишонч ёрлиғи”, “Далолатнома”, “Илмий хулоса” олинган'
                    ],
                    'results' => [
                        'Вилоятнинг тарихи, демографик маълумотлари ва жиноятчиликка қарши курашиш борасида амалга оширилган ишлар комплекс ўрганилди;',
                        'Салмоғи юқори бўлган жиноят турлари (ўғрилик, фирибгарлик, номусга тегиш, безорилик, талончилик, босқинчилик, оғир тан жароҳати етказиш, кибержиноят, гиёҳвандлик ва маҳалла жиноятчилиги) ва шахслар тоифаси (вояга етмаганлар, ёшлар, аёллар, илгари судланганлар, ишсизлар) кесимида тадқиқ қилинди;',
                        'Якунланган жиноят ишлари (суд ҳукми ва терговга қадар текширув материаллари) таҳлили орқали жиноятчилик келиб чиқишининг сабаб ва омиллари аниқланди;',
                        'Аҳоли мурожаатлари билан ишлаш амалиёти ўрганилиб, жами 11 321 нафар респондент (7 142 аёл ва 4 179 эркак) иштирокида кенг қамровли социологик тадқиқот ўтказилди;',
                        'Жиноятчиликни барвақт олдини олиш, виктимологик профилактикани кучайтириш ҳамда ваколатли органлар фаолиятини такомиллаштиришга қаратилган 15 га яқин илмий асосланган таклиф ва тавсиялар ишлаб чиқилди;',
                        'Лойиҳа якунида илмий диагноз қўйилиб, келгуси давр учун жиноятчилик тенденциялари прогноз қилинди.'
                    ],
                    'implementation' => [
                        '25 июнь куни Навоий вилояти ИИБ ҳамда Миллий гвардия бошқармасида раҳбарият ва ҳуқуқни муҳофаза қилувчи органлар вакиллари иштирокида расмий тақдимот ўтказилди;',
                        'Тадқиқот натижалари Навоий вилояти ҳокимлиги, вилоят прокуратураси, ИИБ, Миллий гвардия ҳамда барча туман-шаҳар ИИБларига амалиётда фойдаланиш учун тақдим этилди;',
                        'Навоий вилояти ҳокимлиги ва вилоят ИИБдан тадқиқот натижалари амалиётга жорий этилганлиги юзасидан расмий “Ишонч ёрлиғи”, “Далолатнома” ва “Илмий хулоса” олинди.'
                    ],
                    'outcomes' => 'Навоий вилояти ҳокимлиги ва вилоят ИИБ томонидан “Ишонч ёрлиғи”, “Далолатнома” ва “Илмий хулоса” асосида 11 та шаҳар ва туман профилактика тизимига тўлиқ татбиқ этилди.'
                ],

                // 4. Jizzax viloyati (Bajarilgan)
                'jizzakh' => [
                    'slug' => 'jizzakh',
                    'name' => 'Jizzax viloyati',
                    'capital' => 'Jizzax shahri',
                    'population' => 1507400,
                    'status' => 'completed',
                    'status_label' => 'Bajarilgan loyiha',
                    'badge_icon' => '✓',
                    'color' => '#10B981',
                    'project_title' => 'Jizzax viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Kriminologiya tadqiqot instituti tadqiqot guruhi',
                    'period' => '2024–2025 yillar (Yakunlangan)',
                    'goal' => 'Jizzax viloyatida jinoyatchilikning holati, tendensiyalari va sabablarini kompleks kriminologik tahlil qilish hamda uning oldini olishga qaratilgan samarali ilmiy-amaliy taklif va mexanizmlarni ishlab chiqish.',
                    'results' => [
                        'M-39 xalqaro tranzit yo\'nalishida kriminogen barqarorlikni ta\'minlash bo\'yicha tavsiyalar ishlab chiqildi;',
                        'Qishloq hududlarida mulk va chorva o\'g\'riliklarining barvaqt profilaktikasi mexanizmi tatbiq etildi;',
                        'Mahalla yettiligi bilan profilaktika inspektorlarining hamkorlikdagi elektron monitoring tizimi takomillashtirildi.'
                    ],
                    'outcomes' => '13 ta tuman va shahar bo\'yicha kriminologik tahlillar asosida hududiy chora-tadbirlar rejasi qabul qilindi.'
                ],

                // 5. Buxoro viloyati (Bajarilgan)
                'bukhara' => [
                    'slug' => 'bukhara',
                    'name' => 'Buxoro viloyati',
                    'capital' => 'Buxoro shahri',
                    'population' => 2044000,
                    'status' => 'completed',
                    'status_label' => 'Bajarilgan loyiha',
                    'badge_icon' => '✓',
                    'color' => '#10B981',
                    'project_title' => 'Buxoro viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Kriminologiya tadqiqot instituti tadqiqot guruhi',
                    'period' => '2024–2025 yillar (Yakunlangan)',
                    'goal' => 'Buxoro viloyatida jinoyatchilikning umumiy holati, tuzilishi, dinamikasi va hududiy xususiyatlarini, shuningdek, viloyatdagi firibgarlik jinoyatining zamonaviy ko\'rinishlari, sodir etilish mexanizmlari va uni keltirib chiqaruvchi omillarni kompleks kriminologik tahlil qilish hamda jinoyatchilikni, ayniqsa, firibgarlik jinoyatlarini barvaqt oldini olishga qaratilgan samarali ilmiy-amaliy taklif va mexanizmlarni ishlab chiqishdan iborat.',
                    'results' => [
                        'Viloyatda firibgarlik jinoyatlarining zamonaviy ko\'rinishlari va tahlili o\'tkazildi;',
                        'Sayyohlik ob\'ektlari va tarixiy markazda xavfsiz muhit yaratish bo\'yicha ilmiy tavsiyalar ishlab chiqildi;',
                        'Aholi o\'rtasida moliyaviy-raqamli firibgarlik qurboniga aylanib qolmaslik bo\'yicha maxsus dastur joriy etildi.'
                    ],
                    'outcomes' => '13 ta tuman va shahar bo\'yicha to\'liq kriminologik tahlil o\'tkazildi va firibgarlikka qarshi maxsus metodika tasdiqlandi.'
                ],

                // 6. Qoraqalpog'iston Respublikasi (Bajarilgan)
                'karakalpakstan' => [
                    'slug' => 'karakalpakstan',
                    'name' => 'Qoraqalpog\'iston Respublikasi',
                    'capital' => 'Nukus shahri',
                    'population' => 2002700,
                    'status' => 'completed',
                    'status_label' => 'Bajarilgan loyiha',
                    'badge_icon' => '✓',
                    'color' => '#10B981',
                    'project_title' => 'Qoraqalpog\'iston jinoyatchiligini tadqiq qilish',
                    'team' => 'Kriminologiya tadqiqot instituti tadqiqot guruhi',
                    'period' => '2024–2025 yillar (Yakunlangan)',
                    'goal' => 'Qoraqalpog\'iston Respublikasida jinoyatchilikning holati, mintaqaviy xususiyatlari, sabab va shart-sharoitlarini kompleks kriminologik tahlil qilish hamda Orolbo\'yi mintaqasida huquqbuzarliklar profilaktikasining samaradorligini oshirish bo\'yicha ilmiy-amaliy tavsiyalar ishlab chiqish.',
                    'results' => [
                        'Mulkiy jinoyatlar (o\'g\'rilik va firibgarlik)ning sabablarini bartaraf etish bo\'yicha metodik qo\'llanma ishlab chiqildi;',
                        'Orolbo\'yi yoshlari va voyaga yetmaganlar o\'rtasida huquqbuzarliklar profilaktikasi tatbiq qilindi;',
                        'Olis ovul va qishloqlarda "Xavfsiz mahalla" tizimini joriy etish algoritmi yaratildi.'
                    ],
                    'outcomes' => 'Nukus shahri va barcha 17 ta tuman bo\'yicha to\'liq ilmiy-amaliy kriminologik xulosalar amaliyotga kiritildi.'
                ],

                // 7. Toshkent viloyati (Bajarilgan)
                'tashkent_region' => [
                    'slug' => 'tashkent_region',
                    'name' => 'Toshkent viloyati',
                    'capital' => 'Nurafshon shahri',
                    'population' => 3051800,
                    'status' => 'completed',
                    'status_label' => 'Bajarilgan loyiha',
                    'badge_icon' => '✓',
                    'color' => '#10B981',
                    'project_title' => 'Toshkent viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Kriminologiya tadqiqot institutining 12 nafar tadqiqot jamoasi',
                    'period' => '2024–2025 yillar davomida bajarildi',
                    'goal' => 'Kriminologiya tadqiqot institutining 12 nafar tadqiqot jamoasi tomonidan 2024-2025 yillar davomida “Toshkent viloyati jinoyatchiligini tadqiq qilish” nomli ilmiy-amaliy tadqiqot loyihasi bajarildi. Tadqiqot maqsadi – Toshkent viloyatida jinoyatchilikning holati, tendensiyalari va sabablarini kompleks kriminologik tahlil qilish hamda uning oldini olishga qaratilgan samarali ilmiy-amaliy taklif va mexanizmlarni ishlab chiqish.',
                    'results' => [
                        'Institutning 12 nafar yuqori malakali ilmiy xodimidan iborat maxsus guruh tomonidan amalga oshirildi;',
                        'Poytaxt atrofidagi aglomeratsiya va yuqori migratsion oqimga ega tumanlar chuqur tahlil qilindi;',
                        'Tog\'li turizm hududlari (Bo\'stonliq) va sanoat markazlari (Olmaliq, Chirchiq, Angren) bo\'yicha maxsus xavfsizlik paketi ishlab chiqildi.'
                    ],
                    'outcomes' => '22 ta tuman va shahar qamrab olinib, kriminogen vaziyatni barqarorlashtirish bo\'yicha kompleks chora-tadbirlar tasdiqlandi.'
                ],

                // 8. Farg'ona viloyati (Bajarilayotgan)
                'fergana' => [
                    'slug' => 'fergana',
                    'name' => 'Farg\'ona viloyati',
                    'capital' => 'Farg\'ona shahri',
                    'population' => 4065400,
                    'status' => 'in_progress',
                    'status_label' => 'Bajarilayotgan loyiha',
                    'badge_icon' => '🔍',
                    'color' => '#2C3E6B',
                    'project_title' => 'Farg\'ona viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Kriminologiya tadqiqot instituti ilmiy tadqiqot guruhi',
                    'period' => '2025–2026 yillar (Amalga oshirilmoqda)',
                    'goal' => 'Farg\'ona viloyatida jinoyatchilikning umumiy holati, kriminogen omillari va hududiy dinamikasini ilmiy tadqiq qilish hamda barvaqt profilaktika mexanizmlarini yaratish.',
                    'results' => [
                        'Aholi zich joylashgan shaharlarda (Qo\'qon, Marg\'ilon, Farg\'ona) kriminogen holat o\'rganilmoqda;',
                        'Savdo va xizmat ko\'rsatish sohalarida mulkiy nizolarni bartaraf etish bo\'yicha dala tadqiqotlari olib borilmoqda;'
                    ],
                    'outcomes' => 'Hozirgi vaqtda so\'rovnomalar va statistik tahlillar asosida dastlabki loyiha tavsiyalari tayyorlanmoqda.'
                ],

                // 9. Toshkent shahri (Bajarilayotgan)
                'tashkent_city' => [
                    'slug' => 'tashkent_city',
                    'name' => 'Toshkent shahri',
                    'capital' => 'Toshkent shahri',
                    'population' => 3040800,
                    'status' => 'in_progress',
                    'status_label' => 'Bajarilayotgan loyiha',
                    'badge_icon' => '🔍',
                    'color' => '#2C3E6B',
                    'project_title' => 'Toshkent shahar jinoyatchiligini tadqiq qilish',
                    'team' => 'Institut Urbanizatsiya va poytaxt kriminologiyasi bo\'limi',
                    'period' => '2025–2026 yillar (Amalga oshirilmoqda)',
                    'goal' => 'Poytaxt megapolis sharoitida jinoyatchilik tendensiyalari, kiberjinoyatlar va urbanizatsiya bilan bog\'liq kriminogen omillarni kompleks ilmiy o\'rganish.',
                    'results' => [
                        'Poytaxtning 12 ta tumani kesimida axborot texnologiyalari orqali sodir etilayotgan jinoyatlar o\'rganilmoqda;',
                        '"Smart City" videokuzatuv tizimini kriminologik joylashtirish choralari tahlil qilinmoqda;'
                    ],
                    'outcomes' => 'Toshkent shahar IIBB bilan hamkorlikda oraliq tahliliy ma\'lumotlar tayyorlanmoqda.'
                ],

                // 10. Sirdaryo viloyati (Bajarilayotgan)
                'syrdarya' => [
                    'slug' => 'syrdarya',
                    'name' => 'Sirdaryo viloyati',
                    'capital' => 'Guliston shahri',
                    'population' => 914000,
                    'status' => 'in_progress',
                    'status_label' => 'Bajarilayotgan loyiha',
                    'badge_icon' => '🔍',
                    'color' => '#2C3E6B',
                    'project_title' => 'Sirdaryo viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Institut Hududiy monitoring sektori',
                    'period' => '2025–2026 yillar (Amalga oshirilmoqda)',
                    'goal' => 'Sirdaryo viloyatida agrar soha, tabiiy resurslar va tranzit yo\'nalishlardagi jinoyatchilik sabablarini aniqlash hamda profilaktika choralarini ishlab chiqish.',
                    'results' => [
                        'Viloyat tumanlarida kriminogen vaziyat bo\'yicha empirik ma\'lumotlar to\'planmoqda;',
                        'Fermer xo\'jaliklari va qishloq joylarida profilaktika mexanizmlari sinovdan o\'tkazilmoqda;'
                    ],
                    'outcomes' => '11 ta tuman va shahar bo\'yicha o\'rganishlar davom etmoqda.'
                ],

                // 11. Samarqand viloyati (Bajarilayotgan)
                'samarkand' => [
                    'slug' => 'samarkand',
                    'name' => 'Samarqand viloyati',
                    'capital' => 'Samarqand shahri',
                    'population' => 4220200,
                    'status' => 'in_progress',
                    'status_label' => 'Bajarilayotgan loyiha',
                    'badge_icon' => '🔍',
                    'color' => '#2C3E6B',
                    'project_title' => 'Samarqand viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Institut Xalqaro turizm va hududiy xavfsizlik sektori',
                    'period' => '2025–2026 yillar (Amalga oshirilmoqda)',
                    'goal' => 'Samarqand viloyatining xalqaro turizm markazlari, aholi gavjum tumanlari va qishloq hududlarida kriminogen barqarorlikni ta\'minlash ilmiy mexanizmini yaratish.',
                    'results' => [
                        'Sayyohlik klasterlarida xavfsiz muhitni ta\'minlash choralari tahlil qilinmoqda;',
                        'Viloyatning 16 ta tuman va shaharlarida kriminogen xavf darajalari baholanmoqda;'
                    ],
                    'outcomes' => 'Kriminologik so\'rovnomalar va tadqiqot ishlari olib borilmoqda.'
                ],

                // 12. Surxondaryo viloyati (Bajarilayotgan)
                'surkhandarya' => [
                    'slug' => 'surkhandarya',
                    'name' => 'Surxondaryo viloyati',
                    'capital' => 'Termiz shahri',
                    'population' => 2877100,
                    'status' => 'in_progress',
                    'status_label' => 'Bajarilayotgan loyiha',
                    'badge_icon' => '🔍',
                    'color' => '#2C3E6B',
                    'project_title' => 'Surxondaryo viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Institut Chegaraoldi kriminologiyasi guruhi',
                    'period' => '2025–2026 yillar (Amalga oshirilmoqda)',
                    'goal' => 'Surxondaryo viloyatining chegaraoldi hududlari va tog\'li tumanlarida kriminogen xatarlarning barvaqt oldini olish mexanizmlarini tadqiq qilish.',
                    'results' => [
                        'Termiz, Denov, Sariosiyo tumanlarida kriminogen vaziyat o\'rganilmoqda;',
                        'Narkotik va kontrabanda jinoyatlarining oldini olish bo\'yicha ma\'lumotlar tahlil qilinmoqda;'
                    ],
                    'outcomes' => 'Ilmiy xulosalar tayyorlash bosqichida.'
                ],

                // 13. Xorazm viloyati (Bajarilayotgan)
                'khorezm' => [
                    'slug' => 'khorezm',
                    'name' => 'Xorazm viloyati',
                    'capital' => 'Urganch shahri',
                    'population' => 2005700,
                    'status' => 'in_progress',
                    'status_label' => 'Bajarilayotgan loyiha',
                    'badge_icon' => '🔍',
                    'color' => '#2C3E6B',
                    'project_title' => 'Xorazm jinoyatchiligini tadqiq qilish',
                    'team' => 'Institut Mintaqaviy xavfsizlik laboratoriyasi',
                    'period' => '2025–2026 yillar (Amalga oshirilmoqda)',
                    'goal' => 'Xorazm viloyati va Xiva shahrida sayyohlik mavsumidagi jinoyatchilik, mulkiy va kiberjinoyatlar dinamikasini ilmiy tahlil qilish.',
                    'results' => [
                        'Urganch va Xiva shaharlarida sayyohlar xavfsizligi choralari o\'rganilmoqda;',
                        'Tumanlarda mayda o\'g\'rilik va bezorilik profilaktikasi algoritmlari loyihalanmoqda;'
                    ],
                    'outcomes' => 'Statistik ma\'lumotlarni umumlashtirish ishlari davom etmoqda.'
                ],

                // 14. Qashqadaryo viloyati (Bajarilayotgan)
                'kashkadarya' => [
                    'slug' => 'kashkadarya',
                    'name' => 'Qashqadaryo viloyati',
                    'capital' => 'Qarshi shahri',
                    'population' => 3560600,
                    'status' => 'in_progress',
                    'status_label' => 'Bajarilayotgan loyiha',
                    'badge_icon' => '🔍',
                    'color' => '#2C3E6B',
                    'project_title' => 'Qashqadaryo viloyati jinoyatchiligini tadqiq qilish',
                    'team' => 'Institut Hududiy ijtimoiy tahlil guruhi',
                    'period' => '2025–2026 yillar (Amalga oshirilmoqda)',
                    'goal' => 'Qashqadaryo viloyatining neft-gaz sanoati klasterlari, yaylov va qishloq tumanlarida mulkiy jinoyatlarni barvaqt jilovlash uslubiyotini yaratish.',
                    'results' => [
                        'Qarshi shahri va yirik tumanlarda jinoyatchilik tendensiyalari tahlil qilinmoqda;',
                        'Qishloq joylarida chorva va shaxsiy mulk daxlsizligi choralari o\'rganilmoqda;'
                    ],
                    'outcomes' => '16 ta tuman va shahar bo\'yicha empirik tadqiqotlar o\'tkazilmoqda.'
                ],
            ]
        ];

        self::attachProjectAssets($data['regions']);

        return $data;
    }

    /**
     * Attach PDF document metadata and field visit photo gallery (public/img) to each region
     */
    private static function attachProjectAssets(array &$regions): void
    {
        $photos = [
            [
                'id' => 1,
                'image' => '/img/photo_2026-10-02_09-17-43.jpg',
                'title_suffix' => 'IIB Huquqbuzarliklar profilaktikasi bo\'limi',
                'address_suffix' => 'Markaziy IIB binosi, Profilaktika xizmati',
                'date' => '2025-yil 12-noyabr',
                'category' => 'Profilaktika xizmati',
                'category_badge' => '#38BDF8',
                'caption' => 'Institut tadqiqot guruhi tomonidan hududdagi kriminogen vaziyat, "qizil" toifadagi mahallalar va profilaktika inspektorlarining manzilli faoliyatini joyida kompleks tahlil qilish jarayoni.'
            ],
            [
                'id' => 2,
                'image' => '/img/photo_2026-10-02_09-18-05.jpg',
                'title_suffix' => 'Mahalla fuqarolar yig\'inida «Mahalla yettiligi» bilan uchrashuv',
                'address_suffix' => 'Namunaviy MFY majmuasi',
                'date' => '2025-yil 18-noyabr',
                'category' => 'Mahalla tahlili',
                'category_badge' => '#10B981',
                'caption' => 'Oila-turmush doirasidagi nizolar, yoshlar va ishsizlar o\'rtasida jinoyatlarning barvaqt oldini olish bo\'yicha mahalla mutasaddilari bilan o\'tkazilgan ilmiy-amaliy muloqot.'
            ],
            [
                'id' => 3,
                'image' => '/img/photo_2026-10-02_09-18-09.jpg',
                'title_suffix' => 'Hududiy kriminologik monitoring va kiberxavfsizlik tahlil punkti',
                'address_suffix' => 'Kriminologik situatsion tahlil markazi',
                'date' => '2025-yil 24-noyabr',
                'category' => 'Kriminologik monitoring',
                'category_badge' => '#F59E0B',
                'caption' => 'Hududda axborot texnologiyalari orqali sodir etilayotgan firibgarliklar, kiberjinoyatlar va mulkiy tajovuzlar dinamikasini kompleks o\'rganish.'
            ],
            [
                'id' => 4,
                'image' => '/img/photo_2026-10-02_09-18-13.jpg',
                'title_suffix' => 'Ilmiy xulosalar taqdimoti va kriminologik pasportlarni joriy etish',
                'address_suffix' => 'Huquqni muhofaza qiluvchi organlar forumi',
                'date' => '2025-yil 5-dekabr',
                'category' => 'Natijalar tatbiqi',
                'category_badge' => '#8B5CF6',
                'caption' => 'Tadqiqot yakunlari bo\'yicha ishlab chiqilgan ilmiy takliflar, uslubiy qo\'llanmalar hamda tumanlar kriminologik pasportlarining amaliyotga joriy etilishi.'
            ]
        ];

        foreach ($regions as $slug => &$item) {
            $isComp = ($item['status'] === 'completed');
            $regName = $item['name'];
            $capital = $item['capital'];

            // PDF metadata
            $item['pdf'] = [
                'has_pdf' => true,
                'title' => $isComp 
                    ? "{$regName} bo'yicha tasdiqlangan ilmiy-amaliy loyiha hisoboti va buyrug'i"
                    : "{$regName} bo'yicha ilmiy tadqiqot rejasi va dastlabki oraliq xulosa",
                'doc_number' => '№ 1628-сон',
                'date' => $isComp ? '07.11.2024 yil' : '2025/2026-yil',
                'file_size' => '6.1 MB',
                'pages' => 15,
                'badge' => $isComp ? 'Tasdiqlangan hisobot' : 'Ilmiy dastur',
                'institution' => 'O\'zbekiston Respublikasi Kriminologiya tadqiqot instituti',
                'summary' => "O'zbekiston Respublikasi Kriminologiya tadqiqot instituti Ilmiy kengashi qarori bilan tasdiqlangan «{$item['project_title']}» loyihasining to'liq me'yoriy hujjati.",
                'url' => route('loyiha.pdf.view'),
                'download_url' => route('loyiha.pdf.download'),
            ];

            // Tailored visited field locations
            $item['visited_locations'] = [
                [
                    'id' => 1,
                    'image' => $photos[0]['image'],
                    'title' => "{$regName} {$photos[0]['title_suffix']}",
                    'address' => "{$capital}, {$photos[0]['address_suffix']}",
                    'date' => $photos[0]['date'],
                    'category' => $photos[0]['category'],
                    'category_badge' => $photos[0]['category_badge'],
                    'caption' => $photos[0]['caption'],
                ],
                [
                    'id' => 2,
                    'image' => $photos[1]['image'],
                    'title' => "{$regName} {$photos[1]['title_suffix']}",
                    'address' => "{$capital}, {$photos[1]['address_suffix']}",
                    'date' => $photos[1]['date'],
                    'category' => $photos[1]['category'],
                    'category_badge' => $photos[1]['category_badge'],
                    'caption' => $photos[1]['caption'],
                ],
                [
                    'id' => 3,
                    'image' => $photos[2]['image'],
                    'title' => "{$regName} {$photos[2]['title_suffix']}",
                    'address' => "{$capital}, {$photos[2]['address_suffix']}",
                    'date' => $photos[2]['date'],
                    'category' => $photos[2]['category'],
                    'category_badge' => $photos[2]['category_badge'],
                    'caption' => $photos[2]['caption'],
                ],
                [
                    'id' => 4,
                    'image' => $photos[3]['image'],
                    'title' => "{$regName} {$photos[3]['title_suffix']}",
                    'address' => "{$capital}, {$photos[3]['address_suffix']}",
                    'date' => $photos[3]['date'],
                    'category' => $photos[3]['category'],
                    'category_badge' => $photos[3]['category_badge'],
                    'caption' => $photos[3]['caption'],
                ],
            ];
        }
    }

    /**
     * Stream the sample PDF document inline
     */
    public function viewPdf()
    {
        $filePath = public_path('pdf/1_PDFsam_1628-сон буйруқ 07.11.2024 йил.pdf');
        if (!file_exists($filePath)) {
            abort(404, 'PDF fayl topilmadi');
        }

        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="kriminologiya-loyiha-buyruq-1628.pdf"',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Download the sample PDF document
     */
    public function downloadPdf()
    {
        $filePath = public_path('pdf/1_PDFsam_1628-сон буйруқ 07.11.2024 йил.pdf');
        if (!file_exists($filePath)) {
            abort(404, 'PDF fayl topilmadi');
        }

        return response()->download($filePath, '1628-sonli_buyruq_loyiha_hujjati.pdf', [
            'Content-Type' => 'application/pdf'
        ]);
    }

    /**
     * Show the Loyihalar map page.
     */
    public function index()
    {
        $data = self::getLoyihalarData();
        $overall = $data['overall'];
        $regionsLoyiha = $data['regions'];

        $regions = Region::where('is_active', true)
            ->with(['districtCrimes'])
            ->get();

        $regionsData = $regions->map(function ($r) {
            return [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'capital' => $r->capital,
                'population' => $r->population,
                'districts_count' => $r->districts_count,
                'districts' => $r->districtCrimes,
            ];
        })->keyBy('slug');

        return view('loyiha.index', compact('overall', 'regionsLoyiha', 'regions', 'regionsData'));
    }

    /**
     * API endpoint to get details of a specific region's project.
     */
    public function show(string $region): JsonResponse
    {
        $data = self::getLoyihalarData();
        $regionsLoyiha = $data['regions'];

        if (!isset($regionsLoyiha[$region])) {
            return response()->json([
                'success' => false,
                'message' => 'Hudud topilmadi'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $regionsLoyiha[$region]
        ]);
    }
}
