<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MetodikaController extends Controller
{
    /**
     * Get all methodological guides data structured for regions.
     */
    public static function getMetodikaData(): array
    {
        return [
            'overall' => [
                'total_manuals' => 38,
                'approved_regions_count' => 2,
                'approved_regions' => ['Qoraqalpog\'iston Respublikasi', 'Namangan viloyati'],
                'in_progress_regions_count' => 12,
                'total_algorithms' => 24,
                'year' => 2026,
                'scientific_council' => 'O\'zbekiston Respublikasi Kriminologiya tadqiqot instituti Ilmiy kengashi',
                'directions' => [
                    ['name' => 'Mulkiy jinoyatlar (o\'g\'rilik, firibgarlik)', 'count' => 10, 'color' => '#DC2626'],
                    ['name' => 'Axborot texnologiyalari (kiberjinoyat)', 'count' => 8, 'color' => '#06B6D4'],
                    ['name' => 'Oila-turmush va shaxslar profilaktikasi', 'count' => 8, 'color' => '#EC4899'],
                    ['name' => 'Yoshlar va voyaga yetmaganlar kriminologiyasi', 'count' => 6, 'color' => '#3B82F6'],
                    ['name' => 'Jamoat xavfsizligi va "Xavfsiz shahar"', 'count' => 6, 'color' => '#10B981'],
                ]
            ],
            'regions' => [
                'karakalpakstan' => [
                    'slug' => 'karakalpakstan',
                    'name' => 'Qoraqalpog\'iston Respublikasi',
                    'capital' => 'Nukus shahri',
                    'population' => 2002700,
                    'is_approved' => true,
                    'color' => '#10B981',
                    'status_badge' => 'Tasdiqlangan va amaliyotga joriy etilgan',
                    'manuals_count' => 3,
                    'responsible' => 'Institut Mulkiy jinoyatlar va Yoshlar kriminologiyasi bo\'limlari',
                    'manuals' => [
                        [
                            'id' => 'qq-1',
                            'title' => 'Qoraqalpog\'iston Respublikasida mulkiy jinoyatlar (o\'g\'rilik va firibgarlik)ning barvaqt profilaktikasi bo\'yicha metodik qo\'llanma',
                            'year' => 2026,
                            'approval_date' => '2026-yil 15-yanvar (Ilmiy kengash 1-son bayonnomasi)',
                            'target_areas' => 'Nukus shahri, Beruniy, To\'rtko\'l, Qo\'ng\'irot va barcha 17 ta tuman',
                            'summary' => 'Orolbo\'yi mintaqasining ijtimoiy-iqtisodiy xususiyatlarini inobatga olgan holda o\'g\'rilik va firibgarliklarning kelib chiqish sabab va shart-sharoitlarini bartaraf etish hamda aholining moliyaviy-huquqiy savodxonligini oshirish mexanizmlari.',
                            'chapters' => [
                                '1-bob. Hududda sodir etilayotgan o\'g\'rilik va firibgarlik jinoyatlarining kriminologik tavsifi va tumanlar kesimidagi tahlili',
                                '2-bob. Savdo majmualari, dehqon bozorlari va gavjum jamoat joylarida "Xavfsiz hudud" intellektual videokuzatuv tizimlarini joriy etish',
                                '3-bob. Aholining zaif qatlamlari, keksalar va ayollar o\'rtasida firibgarlik qurboniga aylanib qolmaslik bo\'yicha targ\'ibot algoritmi',
                                '4-bob. Mahalla yettiligi va profilaktika inspektorlarining birgalikdagi amaliy harakatlar rejasi'
                            ],
                            'practical_steps' => [
                                'Bozorlar va savdo markazlariga 120 ta zamonaviy yuzni taniy oluvchi kameralar o\'rnatish;',
                                'Mahallalarda har haftalik "Firibgarlikdan ogoh bo\'ling" tushuntirish reydlarini tashkil etish;',
                                'Muqaddam mulkiy jinoyat sodir etgan shaxslar bilan individual kriminologik profilaktika o\'tkazish;'
                            ],
                            'responsible_orgs' => 'Qoraqalpog\'iston Respublikasi IIV, Milliy gvardiya boshqarmasi, Mahalla uyushmasi'
                        ],
                        [
                            'id' => 'qq-2',
                            'title' => 'Orolbo\'yi hududida yoshlar va voyaga yetmaganlar o\'rtasida huquqbuzarliklar profilaktikasini tashkil etish metodikasi',
                            'year' => 2026,
                            'approval_date' => '2026-yil 22-fevral (Institut ekspert kengashi)',
                            'target_areas' => 'Nukus shahri, Taxiatosh, Amudaryo, Xo\'jayli tumanlari ta\'lim muassasalari',
                            'summary' => 'Ta\'lim muassasalarida davomatni monitoring qilish, o\'quvchi-yoshlarning bo\'sh vaqtini mazmunli tashkil etish hamda kriminogen muhitga tushib qolgan yoshlar bilan individual ishlash tizimi.',
                            'chapters' => [
                                '1-bob. Qoraqalpog\'iston yoshlari o\'rtasida jinoyatchilik dinamikasi va unga ta\'sir qiluvchi omillar',
                                '2-bob. Umumta\'lim maktablari va kasb-hunar maktablarida "Qalqon" jamoatchilik guruhlari faoliyatini kuchaytirish',
                                '3-bob. Tarbiyasi og\'ir va xulqi og\'uvchi o\'smirlarni sport va axborot texnologiyalari to\'garaklariga 100% jalb etish',
                                '4-bob. Ota-onalar va ta\'lim muassasalari hamkorligida "Xavfsiz maktab" dasturini tatbiq etish'
                            ],
                            'practical_steps' => [
                                'Nukus shahri va barcha tumanlardagi maktablarda psixologik-kriminologik so\'rovnomalar o\'tkazish;',
                                'Bo\'sh vaqti ko\'p bo\'lgan yoshlar uchun 18 ta tumanlararo sport musobaqalarini o\'tkazish;',
                                'Voyaga yetmaganlar ishlari bo\'yicha komissiya faoliyatini yangi metodik standartga o\'tkazish;'
                            ],
                            'responsible_orgs' => 'Maktabgacha va maktab ta\'limi vazirligi, Yoshlar ishlari agentligi, Qoraqalpog\'iston IIV'
                        ],
                        [
                            'id' => 'qq-3',
                            'title' => 'Qoraqalpog\'iston Respublikasining olis ovul va tumanlarida "Xavfsiz mahalla" tizimini tatbiq etish amaliy qo\'llanmasi',
                            'year' => 2026,
                            'approval_date' => '2026-yil 12-mart (Ilmiy kengash qarori)',
                            'target_areas' => 'Mo\'ynoq, Qo\'ng\'irot, Taxtako\'pir, Shumanay, Bo\'zatov tumanlari ovul va mahallalari',
                            'summary' => 'Olis va cho\'l hududlarida joylashgan ovullarda jamoatchilik posbonlari, mahalla oqsoqollari va profilaktika inspektorlarining hamkorlikdagi patrullik xizmatini yo\'lga qo\'yish bo\'yicha kriminologik tavsiyalar.',
                            'chapters' => [
                                '1-bob. Ovul va qishloqlarda kriminogen vaziyatni baholashning kriminologik mezonlari',
                                '2-bob. Mahalla faollari va oqsoqollari bilan hamkorlikda nizoli oilalarni barvaqt yarashtirish mexanizmlari',
                                '3-bob. Spirtli ichimliklar va kriminogen xatti-harakatlarga qarshi jamoatchilik patrullarini yo\'lga qo\'yish'
                            ],
                            'practical_steps' => [
                                'Olis hududlardagi 452 ta ovul va mahallada profilaktik postlar faoliyatini modernizatsiya qilish;',
                                'Tungi patrullik faoliyatini GPS texnologiyalari orqali monitoring qilish;'
                            ],
                            'responsible_orgs' => 'Mahalla uyushmasi hududiy bo\'limi, Qoraqalpog\'iston IIV Huquqbuzarliklar profilaktikasi boshqarmasi'
                        ]
                    ]
                ],
                'namangan' => [
                    'slug' => 'namangan',
                    'name' => 'Namangan viloyati',
                    'capital' => 'Namangan shahri',
                    'population' => 3066100,
                    'is_approved' => true,
                    'color' => '#10B981',
                    'status_badge' => 'Tasdiqlangan va amaliyotga joriy etilgan',
                    'manuals_count' => 3,
                    'responsible' => 'Institut Oila-turmush va Kiberxavfsizlik kriminologiyasi laboratoriyalari',
                    'manuals' => [
                        [
                            'id' => 'nam-1',
                            'title' => 'Namangan viloyatida oila-turmush doirasidagi jinoyatlar hamda tan jarohati yetkazish holatlarining barvaqt oldini olish metodikasi',
                            'year' => 2026,
                            'approval_date' => '2026-yil 18-yanvar (Ilmiy kengash 2-son bayonnomasi)',
                            'target_areas' => 'Namangan shahri, Chust, Kosonsoy, To\'raqo\'rg\'on, Chortoq va barcha 14 ta tuman',
                            'summary' => 'Oilaviy nizolarni dastlabki bosqichda aniqlash, "Himoya orderi" berilgan oilalar bilan tizimli profilaktik ishlash va maishiy janjallarning og\'ir jinoyatga aylanib ketishiga yo\'l qo\'ymaslik algoritmlari.',
                            'chapters' => [
                                '1-bob. Namangan viloyatida oilaviy zo\'ravonlik va badanga shikast yetkazish jinoyatlarining kriminologik tahlili',
                                '2-bob. Mahalla xotin-qizlar faoli, psixolog va profilaktika inspektori hamkorligidagi "Nizoli oilalar xaritasi"ni yuritish',
                                '3-bob. Spirtli ichimliklarga ruju qo\'ygan va ruhiy tajovuzkor shaxslarni ijtimoiy-tibbiy reabilitatsiya qilish tartibi',
                                '4-bob. Ziddiyatli oilalarda mediatorlik va murosaga keltirish amaliyoti'
                            ],
                            'practical_steps' => [
                                'Namangan shahri va tumanlarda 214 ta nizoli xonadon bo\'yicha manzilli reabilitatsiya rejasini tasdiqlash;',
                                'Mahallalarda har 10 kunda "Oila tinchligi — jamiyat tinchligi" profilaktik tadbirlarini o\'tkazish;',
                                'Himoya orderi talablarini buzgan shaxslarga nisbatan qat\'iy javobgarlik choralari ko\'rish;'
                            ],
                            'responsible_orgs' => 'Oila va xotin-qizlar boshqarmasi, Namangan viloyati IIB, Mahalla uyushmasi'
                        ],
                        [
                            'id' => 'nam-2',
                            'title' => 'Namangan viloyatida axborot texnologiyalari (kiberjinoyat) orqali sodir etilayotgan firibgarliklarga chek qo\'yish uslubiyoti',
                            'year' => 2026,
                            'approval_date' => '2026-yil 5-fevral (Institut Kiberxavfsizlik markazi)',
                            'target_areas' => 'Namangan shahri, Yangiqo\'rg\'on, Pop, Uychi tumanlari va bank muassasalari',
                            'summary' => 'Bank kartalari ma\'lumotlarini o\'g\'irlash, fishing havolalari, soxta onlayn kreditlar va moliyaviy piramidalar orqali fuqarolar mablag\'larini o\'zlashtirishga qarshi kurashish hamda fosh etish algoritmlari.',
                            'chapters' => [
                                '1-bob. Namangan viloyatida qayd etilgan kiberjinoyatlarning texnik-kriminologik tasnifi',
                                '2-bob. Mobil ilovalar va elektron to\'lov tizimlari orqali noqonuniy pul yechish holatlarini tezkor bloklash protokoli',
                                '3-bob. Aholining raqamli moliyaviy savodxonligini oshirish bo\'yicha "Kiber-ogohlik" maxsus dasturi',
                                '4-bob. Kiberjinoyatlarni tergov qilishda raqamli dalillarni to\'plash va mustahkamlash tartibi'
                            ],
                            'practical_steps' => [
                                'Viloyat bo\'yicha 50 000 dan ortiq fuqarolarga kiberxavfsizlik bo\'yicha qo\'llanma va eslatmalar tarqatish;',
                                'Banklar bilan 24/7 tezkor xabar berish kanalini yo\'lga qo\'yish;',
                                'Onlayn firibgarlik sxemalari bo\'yicha haftalik videoroliklar tayyorlash va tarmoqlarda e\'lon qilish;'
                            ],
                            'responsible_orgs' => 'Namangan viloyati IIB Kiberxavfsizlik bo\'limi, Markaziy bank viloyat boshqarmasi'
                        ],
                        [
                            'id' => 'nam-3',
                            'title' => 'Namangan viloyatining tuman va shaharlarida gavjum jamoat joylarida jinoyatchilikni jilovlash bo\'yicha metodik tavsiyalar',
                            'year' => 2026,
                            'approval_date' => '2026-yil 28-fevral (Ilmiy kengash qarori)',
                            'target_areas' => 'Namangan shahri bozorlari, Chust pichoqchilik markazi, Pop transport kesishmasi',
                            'summary' => 'Bozorlar, avtoshohbekatlar, istirohat bog\'lari va savdo rastalari atrofida bezorilik, talonchilik va o\'g\'riliklarni bartaraf etish bo\'yicha "Xavfsiz hudud" intellektual konsepsiyasi.',
                            'chapters' => [
                                '1-bob. Namangan shahri markaziy dehqon bozori va "Chorsu" atrofida kriminogen vaziyatni boshqarish',
                                '2-bob. Jamoat transporti va bekatlarda huquqbuzarliklar profilaktikasini tashkil etish',
                                '3-bob. Savdo va xizmat ko\'rsatish ob\'ektlari egalari bilan xavfsizlikni ta\'minlash memorandumi'
                            ],
                            'practical_steps' => [
                                'Gavjum hududlarda situatsion monitoring markazlarini tashkil etish;',
                                'Piyoda patrullik marshrutlarini eng kriminogen soatlarga qaratib optimallashtirish;'
                            ],
                            'responsible_orgs' => 'Namangan viloyati IIB Jamoat xavfsizligi xizmati, Milliy gvardiya'
                        ]
                    ]
                ],
                'tashkent_city' => [
                    'slug' => 'tashkent_city',
                    'name' => 'Toshkent shahri',
                    'capital' => 'Toshkent shahri',
                    'population' => 3040800,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 2,
                    'responsible' => 'Institut Urbanizatsiya va poytaxt kriminologiyasi bo\'limi',
                    'manuals' => [
                        [
                            'id' => 'tash-1',
                            'title' => 'Megapolis sharoitida kiberjinoyatlar va mulkiy tajovuzlarga qarshi kurashish metodik qo\'llanmasi (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda (2026-yil II chorak rejasida)',
                            'target_areas' => 'Chilonzor, Yunusobod, Mirzo Ulug\'bek, Olmazor va boshqa 12 ta tuman',
                            'summary' => 'Poytaxtda qayd etilayotgan firibgarlik va kiberjinoyatlarni "Smart City" intellektual platformasi orqali barvaqt aniqlash mexanizmi.',
                            'chapters' => [
                                '1-bob. Toshkent shahrida urbanizatsiya va migratsiya oqimlarining jinoyatchilik dinamikasiga ta\'siri',
                                '2-bob. Metro va jamoat transportida cho\'ntak o\'g\'riliklarini bartaraf etish algoritmi'
                            ],
                            'practical_steps' => ['Videokuzatuv kameralarini AI tahlil tizimiga ulash', 'Ko\'p qavatli uylarda domofon tizimlarini takomillashtirish'],
                            'responsible_orgs' => 'Toshkent shahar IIBB, Raqamli texnologiyalar vazirligi'
                        ]
                    ]
                ],
                'samarkand' => [
                    'slug' => 'samarkand',
                    'name' => 'Samarqand viloyati',
                    'capital' => 'Samarqand shahri',
                    'population' => 4220200,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 2,
                    'responsible' => 'Institut Xalqaro turizm va hududiy xavfsizlik sektori',
                    'manuals' => [
                        [
                            'id' => 'sam-1',
                            'title' => 'Sayyohlik markazlari va tarixiy ob\'ektlar hududida xavfsiz muhitni ta\'minlash kriminologik qo\'llanmasi (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Samarqand shahri, Urgut, Pastdarg\'om tumanlari',
                            'summary' => 'Xavfsiz turizm konsepsiyasi doirasida xorijiy sayyohlar va mehmonlarga nisbatan sodir etilishi mumkin bo\'lgan firibgarlik va huquqbuzarliklarning oldini olish.',
                            'chapters' => [
                                '1-bob. Samarqand turizm klasterida xavfsizlik choralari',
                                '2-bob. Aholisi zich tumanlarda bezorilik profilaktikasi'
                            ],
                            'practical_steps' => ['Turizm politsiyasi xodimlarining metodik tayyorgarligini oshirish'],
                            'responsible_orgs' => 'Samarqand viloyati IIB, Turizm qo\'mitasi'
                        ]
                    ]
                ],
                'fergana' => [
                    'slug' => 'fergana',
                    'name' => 'Farg\'ona viloyati',
                    'capital' => 'Farg\'ona shahri',
                    'population' => 4065400,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 2,
                    'responsible' => 'Institut Vodiy mintaqasi tadqiqot guruhi',
                    'manuals' => [
                        [
                            'id' => 'fer-1',
                            'title' => 'Aholisi zich joylashgan hududlarda nizoli munosabatlarni barvaqt bartaraf etish metodikasi (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Qo\'qon shahri, Marg\'ilon shahri, Farg\'ona shahri',
                            'summary' => 'Qo\'qon va Marg\'ilon shaharlarida savdo va tadbirkorlik sohasidagi nizolarning jinoiy oqibatlarini bartaraf etish.',
                            'chapters' => [
                                '1-bob. Farg\'ona viloyatida mulkiy nizolarning kriminologik jihatlari',
                                '2-bob. Yoshlar bandligini ta\'minlash orqali huquqbuzarliklar profilaktikasi'
                            ],
                            'practical_steps' => ['Mahallalarda tadbirkorlar va yoshlar uchrashuvlarini tizimli o\'tkazish'],
                            'responsible_orgs' => 'Farg\'ona viloyati IIB'
                        ]
                    ]
                ],
                'andijan' => [
                    'slug' => 'andijan',
                    'name' => 'Andijon viloyati',
                    'capital' => 'Andijon shahri',
                    'population' => 3394400,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 1,
                    'responsible' => 'Institut Demografik kriminologiya laboratoriyasi',
                    'manuals' => [
                        [
                            'id' => 'and-1',
                            'title' => 'Yuqori demografik zichlik sharoitida jamoat xavfsizligini ta\'minlash amaliy tavsiyalari (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Andijon shahri, Asaka, Shahrixon tumanlari',
                            'summary' => 'Aholi zichligi yuqori bo\'lgan tumanlarda transport va ko\'cha jinoyatchiligini kamaytirish mexanizmlari.',
                            'chapters' => ['1-bob. Ko\'cha va jamoat joylarida patrul yo\'nalishlarini optimallashtirish'],
                            'practical_steps' => ['Tungi vaqtlarda jamoatchilik nazoratini kuchaytirish'],
                            'responsible_orgs' => 'Andijon viloyati IIB'
                        ]
                    ]
                ],
                'bukhara' => [
                    'slug' => 'bukhara',
                    'name' => 'Buxoro viloyati',
                    'capital' => 'Buxoro shahri',
                    'population' => 2044000,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 1,
                    'responsible' => 'Institut Madaniy meros xavfsizligi guruhi',
                    'manuals' => [
                        [
                            'id' => 'bux-1',
                            'title' => 'Tarixiy obidalarni muhofaza qilish va sayyohlarga xizmat ko\'rsatish xavfsizligi metodikasi (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Buxoro shahri, G\'ijduvon, Kogon tumanlari',
                            'summary' => 'Buxoro shahrining qadimiy qismida huquq-tartibotni saqlash hamda mulkiy jinoyatlarni jilovlash.',
                            'chapters' => ['1-bob. Tarixiy markazda videokuzatuv va piyoda patrullik'],
                            'practical_steps' => ['Turizm marshrutlarida tezkor aloqa tugmalarini o\'rnatish'],
                            'responsible_orgs' => 'Buxoro viloyati IIB'
                        ]
                    ]
                ],
                'kashkadarya' => [
                    'slug' => 'kashkadarya',
                    'name' => 'Qashqadaryo viloyati',
                    'capital' => 'Qarshi shahri',
                    'population' => 3560600,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 1,
                    'responsible' => 'Institut Hududiy ijtimoiy tahlil guruhi',
                    'manuals' => [
                        [
                            'id' => 'qash-1',
                            'title' => 'Qishloq joylarida chorva va mulk o\'g\'riliklarining barvaqt oldini olish uslubiyoti (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Qarshi shahri, Qamashi, Koson, Chiroqchi tumanlari',
                            'summary' => 'Chorva mollarini identifikatsiya qilish va yaylovlarda xavfsizlikni ta\'minlash mexanizmlari.',
                            'chapters' => ['1-bob. Qishloq xo\'jaligi mahsulotlari va chorva xavfsizligi'],
                            'practical_steps' => ['Mahallalarda chorvani chip va tamg\'a orqali hisobga olish'],
                            'responsible_orgs' => 'Qashqadaryo viloyati IIB'
                        ]
                    ]
                ],
                'surkhandarya' => [
                    'slug' => 'surkhandarya',
                    'name' => 'Surxondaryo viloyati',
                    'capital' => 'Termiz shahri',
                    'population' => 2877100,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 1,
                    'responsible' => 'Institut Chegaraoldi kriminologiyasi guruhi',
                    'manuals' => [
                        [
                            'id' => 'sur-1',
                            'title' => 'Chegaraoldi tumanlarida kontrabanda va noqonuniy aylanmalarning kriminologik profilaktikasi (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Termiz shahri, Denov, Sariosiyo tumanlari',
                            'summary' => 'Bojxona va chegara postlari atrofida noqonuniy moddalar aylanmasiga qarshi profilaktik chora-tadbirlar.',
                            'chapters' => ['1-bob. Chegaraoldi hududlarida kriminogen xatarlarni baholash'],
                            'practical_steps' => ['Zamonaviy skaner va rentgen uskunalarini qo\'llash metodikasi'],
                            'responsible_orgs' => 'Surxondaryo viloyati IIB, Bojxona boshqarmasi'
                        ]
                    ]
                ],
                'jizzakh' => [
                    'slug' => 'jizzakh',
                    'name' => 'Jizzax viloyati',
                    'capital' => 'Jizzax shahri',
                    'population' => 1507400,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 1,
                    'responsible' => 'Institut Yo\'l harakati xavfsizligi va jamoat tartibi bo\'limi',
                    'manuals' => [
                        [
                            'id' => 'jiz-1',
                            'title' => 'Tranzit magistral yo\'llar bo\'yida xavfsizlikni ta\'minlash va talonchilikka chek qo\'yish metodikasi (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Jizzax shahri, Sharof Rashidov, G\'allaorol tumanlari',
                            'summary' => 'M-39 xalqaro avtomagistralida yo\'l bo\'yi xizmat ko\'rsatish ob\'ektlarida kriminogen barqarorlikni ta\'minlash.',
                            'chapters' => ['1-bob. Tranzit yo\'llarda kriminogen vaziyatni nazorat qilish'],
                            'practical_steps' => ['Avariya va jinoyatlar xavfi yuqori hududlarda intellektual postlar o\'rnatish'],
                            'responsible_orgs' => 'Jizzax viloyati IIB'
                        ]
                    ]
                ],
                'syrdarya' => [
                    'slug' => 'syrdarya',
                    'name' => 'Sirdaryo viloyati',
                    'capital' => 'Guliston shahri',
                    'population' => 914000,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 1,
                    'responsible' => 'Institut Suv havzalari va agrar kriminologiya sektori',
                    'manuals' => [
                        [
                            'id' => 'syr-1',
                            'title' => 'Agrar sektorda tabiiy resurslar va hosildorlikni asrashning kriminologik profilaktikasi (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Guliston shahri, Yangiyer, Sayxunobod tumanlari',
                            'summary' => 'Suv resurslaridan noqonuniy foydalanish va qishloq xo\'jaligi mulkini talon-toroj qilishning oldini olish.',
                            'chapters' => ['1-bob. Suv xo\'jaligi ob\'ektlarida kriminogen nazorat'],
                            'practical_steps' => ['Fermer xo\'jaliklarida xavfsizlik bo\'yicha o\'quv seminarlari'],
                            'responsible_orgs' => 'Sirdaryo viloyati IIB'
                        ]
                    ]
                ],
                'navoi' => [
                    'slug' => 'navoi',
                    'name' => 'Navoiy viloyati',
                    'capital' => 'Navoiy shahri',
                    'population' => 1075300,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 1,
                    'responsible' => 'Institut Sanoat kriminologiyasi laboratoriyasi',
                    'manuals' => [
                        [
                            'id' => 'nav-1',
                            'title' => 'Tog\'-kon va metallurgiya sanoati ob\'ektlarida mulkiy xavfsizlikni ta\'minlash tavsiyalari (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Navoiy shahri, Zarafshon shahri, Karmana, Uchquduq tumanlari',
                            'summary' => 'Qimmatbaho metallar va sanoat mahsulotlarini noqonuniy olib chiqish holatlariga barham berish uslubiyoti.',
                            'chapters' => ['1-bob. Sanoat klasterlarida ichki xavfsizlik choralari'],
                            'practical_steps' => ['Ishlab chiqarish korxonalarida biometrik nazoratni yo\'lga qo\'yish'],
                            'responsible_orgs' => 'Navoiy viloyati IIB'
                        ]
                    ]
                ],
                'khorezm' => [
                    'slug' => 'khorezm',
                    'name' => 'Xorazm viloyati',
                    'capital' => 'Urganch shahri',
                    'population' => 2005700,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 1,
                    'responsible' => 'Institut Mintaqaviy xavfsizlik guruhi',
                    'manuals' => [
                        [
                            'id' => 'khor-1',
                            'title' => 'Tarixiy turizm shaharlarida kiberjinoyat va mayda bezoriliklar profilaktikasi (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Urganch shahri, Xiva shahri, Xonqa tumanlari',
                            'summary' => 'Xiva shahrida sayyohlik mavsumida xavfsiz muhit yaratish va intellektual xizmatlar ko\'rsatish.',
                            'chapters' => ['1-bob. Xiva shahrida sayyohlar xavfsizligi tizimi'],
                            'practical_steps' => ['Ichan-qal\'a hududida raqamli videokuzatuv tizimini takomillashtirish'],
                            'responsible_orgs' => 'Xorazm viloyati IIB'
                        ]
                    ]
                ],
                'tashkent_region' => [
                    'slug' => 'tashkent_region',
                    'name' => 'Toshkent viloyati',
                    'capital' => 'Nurafshon shahri',
                    'population' => 3051800,
                    'is_approved' => false,
                    'color' => '#2C3E6B',
                    'status_badge' => 'Kriminologik tahlil va metodik ishlab chiqish jarayonida',
                    'manuals_count' => 1,
                    'responsible' => 'Institut Aglomeratsiya va dam olish zonalari xavfsizligi bo\'limi',
                    'manuals' => [
                        [
                            'id' => 'tr-1',
                            'title' => 'Tog\'li rekreatsiya zonalari va shahar atrofida jamoat tartibini saqlash uslubiyoti (Loyiha)',
                            'year' => 2026,
                            'approval_date' => 'Ishlab chiqilmoqda',
                            'target_areas' => 'Bo\'stonliq, Zangiota, Qibray, Chirchiq, Olmaliq',
                            'summary' => 'Dam olish maskanlari, tog\' kurortlari va poytaxt atrofidagi kriminogen faollikni jilovlash.',
                            'chapters' => ['1-bob. Bo\'stonliq turizm zonasida dam oluvchilar xavfsizligi'],
                            'practical_steps' => ['Chorvoq suv ombori atrofida navbatchilik postlarini ko\'paytirish'],
                            'responsible_orgs' => 'Toshkent viloyati IIBB'
                        ]
                    ]
                ]
            ]
        ];
    }

    /**
     * Show the Methodological Manuals Map page.
     */
    public function index()
    {
        $data = self::getMetodikaData();
        $overall = $data['overall'];
        $regionsMetodika = $data['regions'];

        // Get regions from database
        $regions = Region::where('is_active', true)->get();

        return view('metodika.index', compact('overall', 'regionsMetodika', 'regions'));
    }

    /**
     * API endpoint to get details of a specific region's manuals.
     */
    public function show(string $region): JsonResponse
    {
        $data = self::getMetodikaData();
        $regionsMetodika = $data['regions'];

        if (!isset($regionsMetodika[$region])) {
            return response()->json([
                'success' => false,
                'message' => 'Hudud topilmadi'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $regionsMetodika[$region]
        ]);
    }
}
